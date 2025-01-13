document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  const promptInput = document.getElementById('promptInput');
  const responseContainer = document.getElementById('responseContainer');
  const historyContainer = document.getElementById('historyContainer');
  const readAloudButton = document.getElementById('readAloudButton');

  // פונקציה לקריאת טקסט בקול
  const readAloud = () => {
    const text = responseContainer.textContent.trim();
    if (!text) {
      alert('There is no response to read aloud.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // ניתן לשנות ל-"he-IL" לעברית
    speechSynthesis.speak(utterance);
  };

  // מאזין לכפתור Read Aloud
  readAloudButton.addEventListener('click', readAloud);

  // פונקציה לשליחת הודעה לשרת
  const sendMessage = async () => {
    const prompt = promptInput.value;

    if (!prompt) {
      alert('Please enter a prompt');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        responseContainer.textContent = `Bot: ${data.response}`;
        promptInput.value = '';

        // עדכן את ההיסטוריה לאחר שליחת ההודעה
        fetchHistory();
      } else {
        responseContainer.textContent = `Error: ${data.error}`;
      }
    } catch (err) {
      console.error('Error:', err);
      responseContainer.textContent = 'Error communicating with server.';
    }
  };

  // פונקציה לשליפת ההיסטוריה מהשרת
  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/history');
      const history = await res.json();

      // הצגת ההיסטוריה ב-HTML
      historyContainer.innerHTML = ''; // איפוס הקונטיינר
      history.forEach((entry) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
          <p><strong>You:</strong> ${entry.prompt}</p>
          <p><strong>Bot:</strong> ${entry.response}</p>
        `;
        historyContainer.appendChild(historyItem);
      });
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  // מאזין ללחיצה על כפתור שליחה
  sendButton.addEventListener('click', sendMessage);

  // טען את ההיסטוריה כשנטען הדף
  fetchHistory();
});
