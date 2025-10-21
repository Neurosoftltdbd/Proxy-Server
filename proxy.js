import express from "express";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { HttpProxyAgent } from "http-proxy-agent";

const app = express();
const PORT = 8080;

// Middleware to parse JSON body
app.use(express.json());

// Your Bangladesh proxies
const proxyPool = [
  "http://113.11.86.25:4840",
  "http://45.115.113.126:9090",
  "http://180.211.161.110:8080",
  "http://103.148.213.43:7777",
  "http://113.11.127.176:16464",
  "http://203.76.221.116:4840",
  "http://103.230.62.102:8080"
];

let currentIndex = 0;

// Round-robin proxy rotation
function getNextProxy() {
  const proxy = proxyPool[currentIndex];
  currentIndex = (currentIndex + 1) % proxyPool.length;
  return proxy;
}

// POST endpoint: forwards login request via rotating proxy
app.post("/login", async (req, res) => {
  const { mobile_no, password } = req.body;
  if (!mobile_no || !password) {
    return res.status(400).send("❌ Missing mobile_no or password");
  }

  const proxy = getNextProxy();
  console.log(`🌐 Using proxy: ${proxy} → login`);

  try {
    const agent = proxy.startsWith("https")
      ? new HttpsProxyAgent(proxy)
      : new HttpProxyAgent(proxy);

    const response = await fetch("https://payment.ivacbd.com/api/v2/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile_no, password }),
      agent,
      timeout: 10000
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("⚠️ Proxy failed:", err.message);
    res.status(502).send({ error: "Proxy failed", proxy });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
