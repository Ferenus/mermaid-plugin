# Corporate proxy blocking the domain
*.cdn.prod.atlassian-dev.net domain is blocked by corporate proxy. Use forge tunnel to test the changes, it should work fine when served from localhost.

# Testing the changes

## 1. Install root dependencies (if not already done)
`
npm install
`

## 2. Build the frontend
`
cd static/app && npm run build && cd ../..
`

## 3. Deploy to development
`
forge deploy -e development
`

## 4. Use forge tunnel
`
forge tunnel -e development
`

## 4. Launch chrome
`
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --ignore-certificate-errors --user-data-dir="/Users/dstradowski/Library/Application Support/Google/Chrome" --profile-directory="Default" --disable-web-security --disable-site-isolation-trials --disable-features=IsolateOrigins,site-per-process
`

## 5. Open the Confluence page with the component inserted
https://ferenus.atlassian.net/wiki/spaces/~557058ba074e25a30649a4979214faf31ba8a7/pages/edit-v2/2654221

Above URL request requires accepting iframes in Chrome.

### To open the Mermaid Code Editor via Chrome DevTools MCP:
#### Step 1: Wait for the page to load
Wait for the macro iframe to appear.

#### Step 2: Select the macro to trigger the floating toolbar
Run this script via evaluate_script to simulate clicking the macro border, which triggers ProseMirror node selection:
```
() => {
    const wrap = document.querySelector('.extensionView-content-wrap');
    if (!wrap) return 'no wrap';
    const rect = wrap.getBoundingClientRect();
    ['mousedown', 'mouseup', 'click'].forEach(type => {
        wrap.dispatchEvent(new MouseEvent(type, {
            bubbles: true,
            clientX: rect.left + 2,
            clientY: rect.top + 2
        }));
    });
    return 'dispatched';
}
```

The key is dispatching events on .extensionView-content-wrap at its top-left edge (rect.left + 2, rect.top + 2), outside the iframe bounds. Clicking inside the iframe doesn't trigger macro selection.

#### Step 3: Click the Edit button

After the floating toolbar appears, click the Edit button:
```
() => {
    const editBtn = document.querySelector('button[aria-label="Edit"]');
    if (editBtn) { editBtn.click(); return 'clicked'; }
    return 'not found';
}
```

#### Step 4: Wait for the config dialog

Wait for "Mermaid Editor" text to appear. The config dialog loads in a separate iframe on port 8001. Its elements will have a new uid prefix (e.g., uid=2_*) in snapshots.

### To test the published viewer (non-edit mode), navigate to the page view URL:
https://ferenus.atlassian.net/wiki/spaces/~557058ba074e25a30649a4979214faf31ba8a7/pages/2654221/Test+page
Note: You may need to click "Update" in the edit view first to publish changes.

## 6. Connect to the browser on port 9222 and find the tab with Confluence.

## 7. For subsequent code changes, as long as forge tunnel is running, you only need to rebuild the frontend. The tunnel will automatically detect the updated bundle and serve it.
`
cd static/app && npm run build && cd ../..
`