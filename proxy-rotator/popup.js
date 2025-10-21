const btn = document.getElementById("toggleBtn");
let enabled = false;

btn.addEventListener("click", () => {
  enabled = !enabled;
  btn.innerText = enabled ? "Disable Proxy" : "Enable Proxy";

  chrome.runtime.sendMessage({ action: "toggle", value: enabled }, (res) => {
    console.log("Proxy status:", res.status);
  });
});
