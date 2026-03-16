# Testing the changes

### 1. Install root dependencies (if not already done)
`npm install`

### 2. Build the frontend
`cd static/app && npm run build && cd ../..`

### 3. Deploy to development
`forge deploy -e development`

### 4. Use forge tunnel
`forge tunnel -e development`

### 4. Launch chrome
`/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --ignore-certificate-errors --user-data-dir="/Users/dstradowski/Library/Application Support/Google/Chrome" --profile-directory="Default" --disable-web-security --disable-site-isolation-trials --disable-features=IsolateOrigins,site-per-process`

### 5. Open the Confluence page with the component inserted
https://ferenus.atlassian.net/wiki/spaces/~557058ba074e25a30649a4979214faf31ba8a7/pages/edit-v2/2654221

Above URL request requires accepting iframes in Chrome.

To open the code editor (edit plugin view) via Chrome DevTools MCP:
1. Take a snapshot of the page to find the macro iframe area
2. Look for the "Edit" button (it's in the floating toolbar controls that appear when the macro is selected — the macro is auto-selected on page load in edit mode)
3. Click the "Edit" button — this opens the full-screen config dialog with the code editor
4. The config dialog loads in a separate iframe on port 8001 (via forge tunnel). Its elements will appear with a new uid prefix (e.g., uid=2_*) in the snapshot

To test the published viewer (non-edit mode), navigate to the page view URL:
https://ferenus.atlassian.net/wiki/spaces/~557058ba074e25a30649a4979214faf31ba8a7/pages/2654221/Test+page
Note: You may need to click "Update" in the edit view first to publish changes.

### 6. Connect to the browser on port 9222 and find the tab with Confluence.

### 7. For subsequent code changes, as long as forge tunnel is running, you only need to rebuild the frontend. The tunnel will automatically detect the updated bundle and serve it.
`cd static/app && npm run build && cd ../..`