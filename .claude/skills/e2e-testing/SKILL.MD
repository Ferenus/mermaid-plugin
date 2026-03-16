---
name: e2e-testing
description: End to end testing the plugin in the browser
---

# 1. Install root dependencies (if not already done)
npm install

# 2. Build the frontend
cd static/app && npm run build && cd ../..

# 3. Deploy to development
forge deploy -e development

# 4. Use forge tunnel
forge tunnel -e development

# 4. Launch chrome
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --ignore-certificate-errors --user-data-dir="/Users/dstradowski/Library/Application Support/Google/Chrome" --profile-directory="Default" --disable-web-security --disable-site-isolation-trials --disable-features=IsolateOrigins,site-per-process

# 5. Open the Confluence page with the component inserted
https://ferenus.atlassian.net/wiki/spaces/~557058ba074e25a30649a4979214faf31ba8a7/pages/edit-v2/2654221
Above URL request requires accepting iframes in Chrome.

To open the code editor (edit plugin view) you have to mouse hover on the macro plugin and click on the "Mermaid Diagrams for Confluence (Development)" which appear and next click on the edit icon.

# 6. Connect to the browser on port 9222 and find the tab with Confluence.

# 7. For subsequent code changes, as long as forge tunnel is running, you only need to rebuild the frontend. The tunnel will automatically detect the updated bundle and serve it.
cd static/app && npm run build && cd ../..