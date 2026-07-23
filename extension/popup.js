document.getElementById("fillBtn").addEventListener("click", () => {
  const status = document.getElementById("status");
  status.textContent = "⏳ جاري التعبئة...";
  status.className = "status";
  chrome.storage.local.get(["profile"], (result) => {
    const profile = result.profile || {};
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "autoFill",
        data: profile
      }, (response) => {
        if (response?.success) {
          status.textContent = "✅ تم التعبئة";
          status.className = "status online";
        } else {
          status.textContent = "❌ فشل التعبئة";
          status.className = "status offline";
        }
      });
    });
  });
});
