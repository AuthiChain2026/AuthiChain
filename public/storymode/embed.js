// Storymode Embed Widget
// Allows partners to embed Storymode narratives on any website

(function () {
  function renderStory(container, productId) {
    const stream = new EventSource(`/api/storymode?product_id=${productId}`);

    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.fontFamily = 'inherit';
    pre.style.lineHeight = '1.5';
    pre.style.padding = '1rem';
    pre.style.border = '1px solid #ddd';
    pre.style.borderRadius = '8px';
    pre.style.background = '#fafafa';

    container.appendChild(pre);

    stream.onmessage = (event) => {
      pre.textContent += event.data;
    };

    stream.onerror = () => {
      stream.close();
    };
  }

  function init() {
    const nodes = document.querySelectorAll('[data-storymode]');
    nodes.forEach((node) => {
      const productId = node.getAttribute('product');
      if (productId) {
        renderStory(node, productId);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
