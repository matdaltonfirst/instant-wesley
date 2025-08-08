(function(){
  // Basic styles
  const cfg = (window.WESLEY_AI_CONFIG || {});
  const color = (cfg.brand && cfg.brand.color) || "#1495A0";
  const botName = (cfg.brand && cfg.brand.botName) || "Wesley AI";
  const welcome = cfg.welcome || `Hi! I’m ${botName}. How can I help?`;
  const apiUrl = "/api/ask";
  const contactUrl = cfg.contactUrl || "https://daltonfumc.com/contact";
  const giveUrl = cfg.giveUrl || "https://daltonfumc.com/give";

  const style = document.createElement("style");
  style.textContent = `
    .wesley-bubble {
      position: fixed; right: 18px; bottom: 18px; width: 56px; height: 56px;
      border-radius: 50%; background: ${color}; color: #fff; display: flex;
      align-items: center; justify-content: center; font-weight: 700;
      box-shadow: 0 8px 20px rgba(0,0,0,0.2); cursor: pointer; z-index: 999999;
    }
    .wesley-panel {
      position: fixed; right: 18px; bottom: 86px; width: 360px; max-width: 95vw;
      height: 520px; max-height: 70vh; background: #fff; border-radius: 16px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.2); overflow: hidden; display: none; z-index: 999999;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .wesley-header {
      background: ${color}; color: #fff; padding: 12px 16px; font-weight: 700;
    }
    .wesley-messages { padding: 12px; height: calc(100% - 140px); overflow-y: auto; }
    .wesley-input { display: flex; gap: 8px; padding: 8px; border-top: 1px solid #eee; }
    .wesley-input input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
    .wesley-btn { background: ${color}; color: #fff; border: none; border-radius: 10px; padding: 10px 12px; font-weight: 600; cursor: pointer; }
    .wesley-cta { background: ${color}; color: #fff; border-radius: 10px; padding: 6px 10px; display: inline-block; margin-right: 8px; text-decoration: none; }
    .wesley-secondary { background: #fff; color: ${color}; border: 1px solid ${color}; }
    .wesley-msg { margin: 8px 0; }
    .wesley-msg.user { text-align: right; }
    .wesley-bubble-badge { font-size: 22px; }
  `;
  document.head.appendChild(style);

  // Bubble
  const bubble = document.createElement("div");
  bubble.className = "wesley-bubble";
  bubble.title = botName;
  bubble.innerHTML = `<span class="wesley-bubble-badge">💬</span>`;
  document.body.appendChild(bubble);

  // Panel
  const panel = document.createElement("div");
  panel.className = "wesley-panel";
  panel.innerHTML = `
    <div class="wesley-header">${botName}</div>
    <div class="wesley-messages"></div>
    <div style="padding:8px 12px;">
      <a class="wesley-cta" href="#" data-action="plan">Plan a Visit</a>
      <a class="wesley-cta wesley-secondary" href="${contactUrl}" target="_blank" rel="noopener">Contact</a>
    </div>
    <div class="wesley-input">
      <input placeholder="Ask about service times, events, giving…" />
      <button class="wesley-btn">Send</button>
    </div>
  `;
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector(".wesley-messages");
  const inputEl = panel.querySelector("input");
  const sendBtn = panel.querySelector(".wesley-btn");

  function showPanel() { panel.style.display = "block"; if (!messagesEl.dataset.greeted) {
      addMsg("bot", welcome);
      messagesEl.dataset.greeted = "1";
    }}
  function hidePanel() { panel.style.display = "none"; }
  bubble.addEventListener("click", ()=>{
    if (panel.style.display === "block") hidePanel(); else showPanel();
  });

  function addMsg(role, text) {
    const div = document.createElement("div");
    div.className = "wesley-msg " + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  panel.querySelector('[data-action="plan"]').addEventListener("click", (e)=>{
    e.preventDefault();
    addMsg("bot", "Here’s the quick scoop on planning a visit:\\n• Guest parking: west side of the building.\\n• Kids check-in: Welcome Desk in the main lobby.\\n• Services: 9:30 AM Modern (Worship Center) • 11:00 AM Traditional (Sanctuary).\\nWhat else can I help you with?");
  });

  async function ask(text) {
    addMsg("user", text);
    try {
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await r.json();
      if (data && data.reply) {
        // Optional: detect "give" intent and confirm
        const lower = text.toLowerCase();
        if (lower.includes("give") || lower.includes("tithe") || lower.includes("donate")) {
          addMsg("bot", data.reply + "\\n\\nWould you like me to open the Give page? (yes/no)");
          inputEl.dataset.awaitingGive = "1";
        } else {
          addMsg("bot", data.reply);
        }
      } else {
        addMsg("bot", "Sorry — I had trouble answering. Please try again, or use the Contact page.");
      }
    } catch (e) {
      addMsg("bot", "Oops — network hiccup. Please try again.");
    }
  }

  sendBtn.addEventListener("click", ()=>{
    const text = inputEl.value.trim();
    if (!text) return;
    if (inputEl.dataset.awaitingGive === "1") {
      if (text.toLowerCase().startsWith("y")) {
        window.open(giveUrl, "_blank", "noopener");
        addMsg("bot", "Opening the Give page…");
      } else {
        addMsg("bot", "No problem. Anything else I can help with?");
      }
      delete inputEl.dataset.awaitingGive;
      inputEl.value = "";
      return;
    }
    ask(text);
    inputEl.value = "";
  });
  inputEl.addEventListener("keydown", (e)=>{ if (e.key === "Enter") sendBtn.click(); });

})();