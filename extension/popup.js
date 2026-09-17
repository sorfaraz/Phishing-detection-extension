document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('sensitivity');
    const valDisplay = document.getElementById('val-display');
    const tradeoffText = document.getElementById('tradeoff-text');

    // Load saved sensitivity
    chrome.storage.local.get(['sensitivity', 'lastResult'], function (data) {
        if (data.sensitivity) {
            slider.value = data.sensitivity;
            updateUI(data.sensitivity);
        }
        if (data.lastResult) {
            updateStats(data.lastResult);
        }
    });

    slider.addEventListener('input', function () {
        updateUI(this.value);
    });

    slider.addEventListener('change', function () {
        // Save and notify background to rescan
        const val = parseInt(this.value);
        chrome.storage.local.set({ sensitivity: val }, function () {
            // Reload current tab to trigger re-scan with new settings
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0]) chrome.tabs.reload(tabs[0].id);
            });
        });
    });

    function updateUI(val) {
        valDisplay.textContent = val + "%";
        val = parseInt(val);

        if (val < 30) {
            tradeoffText.textContent = "⚠️ LOW: Very Fast, High Risk of Missed Attacks";
            tradeoffText.style.color = "#d35400";
        } else if (val > 70) {
            tradeoffText.textContent = "🛡️ HIGH: Slow (Deep Scan), High Risk of False Alarms";
            tradeoffText.style.color = "#27ae60";
        } else {
            tradeoffText.textContent = "⚖️ BALANCED: Standard Protection";
            tradeoffText.style.color = "#2980b9";
        }
    }

    function updateStats(res) {
        const resultSpan = document.getElementById('scan-result');
        resultSpan.textContent = res.result;
        resultSpan.className = res.is_phishing ? 'danger' : 'safe';

        document.getElementById('latency-val').textContent = res.process_time;
        document.getElementById('confidence-val').textContent = (res.confidence_score * 100).toFixed(1) + "%";
    }

    // Listen for updates from background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "update_popup") {
            updateStats(request.data);
        }
    });
});
