// Background Service Worker
// Listens for tab updates and sends URLs to the local python backend

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Trigger if the status is complete OR if the URL just changed
    if ((changeInfo.status === 'complete' || changeInfo.url) && tab.url && tab.url.startsWith('http')) {
        checkUrl(tabId, tab.url);
    }
});

async function checkUrl(tabId, url) {
    // Get sensitivity settings
    chrome.storage.local.get(['sensitivity'], async function (data) {
        const sensitivity = data.sensitivity || 50;

        try {
            const response = await fetch('http://localhost:5000/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url, sensitivity: sensitivity })
            });

            const result = await response.json();

            // Store result for popup
            chrome.storage.local.set({ lastResult: result });

            // Notify popup if open
            chrome.runtime.sendMessage({ action: "update_popup", data: result }).catch(() => { });

            if (result.is_phishing) {
                // Send message to content script to block page
                chrome.tabs.sendMessage(tabId, {
                    action: "BLOCK_PAGE",
                    data: result
                }).catch((err) => {
                    // Content script might not be loaded yet on some pages
                    console.log("Could not contact content script", err);
                });
            }
        } catch (err) {
            console.error("Backend connection failed:", err);
        }
    });
}
