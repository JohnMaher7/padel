// Progress ticks. A topic counts as watched once one of its animations plays
// to the end. Like the level, it's remembered in this browser only, so there
// are no accounts.
//
// Anything marked data-watch="<topic>" gets data-watched once that topic is
// watched, and the page's CSS draws the tick.

const KEY = 'watched';
/** This page's ticks, in case the browser won't store them (private browsing can block storage). */
const session = new Set<string>();

export function watched(): Set<string> {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (Array.isArray(stored)) for (const topic of stored) if (typeof topic === 'string') session.add(topic);
  } catch {
    // Unreadable or blocked: keep this page's ticks.
  }
  return new Set(session);
}

export function markWatched(topic: string) {
  const all = watched();
  if (all.has(topic)) return;
  all.add(topic);
  session.add(topic);
  try {
    localStorage.setItem(KEY, JSON.stringify([...all]));
  } catch {
    // The tick then lasts for this page only.
  }
  showTicks();
}

export function showTicks() {
  const all = watched();
  for (const el of document.querySelectorAll<HTMLElement>('[data-watch]')) el.toggleAttribute('data-watched', all.has(el.dataset.watch!));
}

/** Runs `fn` now, and again when the browser brings the page back from its back/forward cache with old ticks. */
export function onShow(fn: () => void) {
  fn();
  window.addEventListener('pageshow', (e) => e.persisted && fn());
}
