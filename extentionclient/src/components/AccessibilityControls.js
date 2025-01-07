import React, { useState } from "react";

function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const increaseFont = () => setFontSize((prev) => prev + 2);
  const decreaseFont = () => setFontSize((prev) => (prev > 10 ? prev - 2 : prev));
  const toggleContrast = () => setHighContrast((prev) => !prev);

  const readAloud = () => {
    const text = document.body.innerText; // כל הטקסט בעמוד
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // אפשר לשנות ל-he-IL לעברית
    speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
      <button onClick={increaseFont}>Increase Font</button>
      <button onClick={decreaseFont}>Decrease Font</button>
      <button onClick={toggleContrast}>
        {highContrast ? "Disable Contrast" : "Enable Contrast"}
      </button>
      <button onClick={readAloud}>Read Aloud</button>
      <style>
        {`
          body {
            font-size: ${fontSize}px;
            background-color: ${highContrast ? "#000" : "#fff"};
            color: ${highContrast ? "#fff" : "#000"};
          }
        `}
      </style>
    </div>
  );
}

export default AccessibilityControls;
