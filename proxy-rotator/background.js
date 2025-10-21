let isEnabled = false;

// Your proxy list
const proxyList = [
  "113.11.86.25:4840",
  "45.115.113.126:9090",
  "180.211.161.110:8080",
  "103.148.213.43:7777",
  "113.11.127.176:16464",
  "203.76.221.116:4840",
  "103.230.62.102:8080"
];

let currentIndex = 0;

function getNextProxy() {
  const proxy = proxyList[currentIndex];
  currentIndex = (currentIndex + 1) % proxyList.length;
  return proxy;
}

// Set proxy configuration
function setProxy() {
  if (!isEnabled) return;

  const [host, port] = getNextProxy().split(":");

  chrome.proxy.settings.set(
    {
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "http",
            host,
            port: parseInt(port)
          }
        }
      },
      scope: "regular"
    },
    () => console.log(`Proxy set to ${host}:${port}`)
  );
}

// Listen for toggle message
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "toggle") {
    isEnabled = msg.value;

    if (isEnabled) {
      setProxy();
      sendResponse({ status: "enabled" });
    } else {
      chrome.proxy.settings.clear({ scope: "regular" }, () => {
        sendResponse({ status: "disabled" });
      });
    }
  }
});
