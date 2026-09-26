// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The toolbar sits over the scene controls on a phone-sized screen.
  devToolbar: { enabled: false },
  // Links have no trailing slash (/situations/opponents-lob-you). Writing each
  // page as a .html file lets Cloudflare serve that address directly, instead
  // of first redirecting it to /situations/opponents-lob-you/.
  build: { format: 'file' },
  trailingSlash: 'never',
});
