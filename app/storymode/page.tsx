export default function StorymodePage() {
  return (
    <main className="prose mx-auto py-20">
      <h1>Storymode</h1>
      <p>The cinematic narrative engine of the AuthiChain Protocol.</p>

      <h2>API Endpoint</h2>
      <pre>POST /api/storymode</pre>

      <h2>What Storymode Does</h2>
      <ul>
        <li>Transforms verified truth into cinematic narrative</li>
        <li>Streams stories in real time using SSE</li>
        <li>Anchors every story in blockchain, QRON, and product metadata</li>
      </ul>

      <h2>Try Storymode</h2>
      <a href="/storymode/viewer" className="underline text-blue-600">Open the Story Viewer</a>
    </main>
  );
}
