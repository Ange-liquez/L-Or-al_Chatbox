const WORKER_URL = "https://shrill-bush-9db8.angeliquezometa.workers.dev";

// Elements
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

// Add message to UI
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "ai-message";
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Call Cloudflare Worker
async function callOpenAI(message) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed request");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response.";
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  try {
    const reply = await callOpenAI(message);
    addMessage(reply, "ai");
  } catch (error) {
    addMessage("Error: " + error.message, "ai");
  }
});
