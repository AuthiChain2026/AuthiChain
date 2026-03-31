'use client';

import { useEffect, useState } from 'react';

export default function StorymodeViewer() {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product_id = params.get('product_id');
    if (!product_id) return;

    setLoading(true);

    const eventSource = new EventSource(`/api/storymode?product_id=${product_id}`);

    eventSource.onmessage = (event) => {
      setStory((prev) => prev + event.data);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
    };

    return () => eventSource.close();
  }, []);

  return (
    <main className="prose mx-auto py-20">
      <h1>Storymode Viewer</h1>
      <p>The cinematic narrative stream for authenticated products.</p>

      {loading && <p><em>Generating story...</em></p>}

      <pre className="whitespace-pre-wrap">{story}</pre>
    </main>
  );
}
