chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autoFill") {
    const fields = document.querySelectorAll("input, select, textarea");
    const data = request.data;
    let filled = 0;
    fields.forEach(field => {
      const name = field.name?.toLowerCase() || "";
      const id = field.id?.toLowerCase() || "";
      Object.keys(data).forEach(key => {
        if (name.includes(key) || id.includes(key)) {
          if (data[key]) {
            field.value = data[key];
            field.dispatchEvent(new Event("input", { bubbles: true }));
            filled++;
          }
        }
      });
    });
    sendResponse({ success: true, filled });
  }
});
