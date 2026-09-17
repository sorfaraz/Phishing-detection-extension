chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "BLOCK_PAGE") {
        showWarning(request.data);
    }
});

function showWarning(data) {
    // Remove existing warning if any
    const existing = document.getElementById('phishing-warning-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'phishing-warning-overlay';
    overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(200, 0, 0, 0.95);
    z-index: 999999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: sans-serif;
    text-align: center;
  `;

    overlay.innerHTML = `
    <h1 style="font-size: 40px; margin-bottom: 20px;">⚠️ PHISHING DETECTED</h1>
    <p style="font-size: 20px; max-width: 600px;">
      The AI Phishing Guard module has identified this page as malicious based on your current security settings.
    </p>
    <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin: 20px; text-align: left;">
      <p><strong>URL:</strong> ${data.url}</p>
      <p><strong>Confidence:</strong> ${(data.confidence_score * 100).toFixed(1)}%</p>
      <p><strong>Mode Used:</strong> ${data.mode}</p>
      <p><strong>Processing Time:</strong> ${data.process_time}</p>
    </div>
    <button id="params-ignore-btn" style="
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background: white;
      border: none;
      border-radius: 5px;
      color: #900;
      font-weight: bold;
    ">I understand the risk, proceed</button>
  `;

    document.body.appendChild(overlay);

    document.getElementById('params-ignore-btn').addEventListener('click', () => {
        overlay.remove();
    });
}
