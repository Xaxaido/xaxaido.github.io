(() => {
  const isRussian = (navigator.languages || [navigator.language || 'en']).some(value => /^ru(?:-|$)/i.test(value));
  if (isRussian) { document.documentElement.lang = 'ru'; return; }
  const dict = window.TD_EN || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed || !Object.prototype.hasOwnProperty.call(dict, trimmed)) continue;
    node.nodeValue = original.replace(trimmed, dict[trimmed]);
  }
  for (const element of document.querySelectorAll('[placeholder], [aria-label], [title], [alt]')) {
    for (const attr of ['placeholder','aria-label','title','alt']) {
      if (element.hasAttribute(attr) && dict[element.getAttribute(attr)]) element.setAttribute(attr, dict[element.getAttribute(attr)]);
    }
  }
  const title = document.querySelector('title');
  if (title && dict[title.textContent.trim()]) title.textContent = dict[title.textContent.trim()];
  const description = document.querySelector('meta[name="description"]');
  if (description && dict[description.content]) description.content = dict[description.content];
  document.documentElement.lang = 'en';
})();