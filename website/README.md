# Website

This is built with nextjs.

It's built (`yarn build`) and then copied into the server's `static/` folder
at `static/website` so it can be served from the same server as the expo app
and the data.

## Paths

The server (in `../server`) is configured to serve only the following URLs:

- `/` and `/index.html` -> the nextjs built `index.html`
- `/favicon.ico` -> the nextjs `out/favicon.ico`
  - Copied from `public/`
- `/_static/` -> nextjs built output `out/_static`
  - This is copied from the `public/static` folder
  - Use this for anything static, anything at the root level of the `public/`
    folder will be ignored
- `/_next/` -> the nextjs built output `out/_next`
  - This is where nextjs builds all its assets
