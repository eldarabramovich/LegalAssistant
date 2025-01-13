document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  const promptInput = document.getElementById('promptInput');
  const responseContainer = document.getElementById('responseContainer');
  const historyContainer = document.getElementById('historyContainer');
  //כפתור העתק
  const copyToClipboard = () => {
    const responseContainer = document.getElementById('responseContainer'); // מציאת האלמנט
    const text = responseContainer.textContent.trim(); // קבלת הטקסט
  
    if (!text) {
      alert('There is no response to copy.');
      return;
    }
  
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Response copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please try again.');
      });
  };
  // מאזין לכפתור Copy
  const copyButton = document.getElementById('copyButton'); // מציאת הכפתור
  copyButton.addEventListener('click', copyToClipboard);

  const adjustTextAlignment = () => {
    const responseContainer = document.getElementById('responseContainer');
    const text = responseContainer.textContent.trim();
  
    if (!text) {
      console.log('No text to adjust alignment for.');
      return;
    }
  
    const hebrewRegex = /[\u0590-\u05FF]/; // זיהוי עברית
    const isHebrew = hebrewRegex.test(text);
  
    if (isHebrew) {
      responseContainer.style.textAlign = 'right'; // יישור לימין לעברית
      responseContainer.style.direction = 'rtl'; // כיוון מימין לשמאל
    } else {
      responseContainer.style.textAlign = 'left'; // יישור לשמאל לאנגלית
      responseContainer.style.direction = 'ltr'; // כיוון משמאל לימין
    }
  };
  
  // הוספת קריאה לפונקציה adjustTextAlignment בכל פעם שהתשובה מתעדכנת
  const updateResponse = (responseText) => {
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.textContent = responseText.trim();
    adjustTextAlignment(); // עדכון יישור
  };
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
        updateResponse(data.response);
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
