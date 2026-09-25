const SVGNS = 'http://www.w3.org/2000/svg';

type Attrs = Record<string, string | number>;

export function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  parent?.appendChild(el);
  return el;
}

export function html<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  parent?: Element,
  text?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (text !== undefined) el.textContent = text;
  parent?.appendChild(el);
  return el;
}

/** Sets several attributes at once. */
export function set(el: Element, attrs: Attrs) {
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
}

/** Only touches the DOM when the text actually changes, which keeps screen readers calm. */
export function setText(el: Element, text: string) {
  if (el.textContent !== text) el.textContent = text;
}
