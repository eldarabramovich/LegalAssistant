document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-button");
    const promptInput = document.getElementById("prompt-input");
    const responseOutput = document.getElementById("response-output");
  
    sendButton.addEventListener("click", async () => {
      const prompt = promptInput.value.trim();
  
      if (!prompt) {
        responseOutput.textContent = "Please enter a prompt.";
        return;
      }
  
      responseOutput.textContent = "Loading...";
      try {
        const res = await fetch("http://localhost:4000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
  
        if (!res.ok) {
          throw new Error(`Server error: ${res.statusText}`);
        }
  
        const data = await res.json();
        responseOutput.textContent = data.response || "No response received.";
      } catch (err) {
        responseOutput.textContent = `Error: ${err.message}`;
      }
    });
  });
  