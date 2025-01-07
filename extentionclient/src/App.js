import React from "react";
import AccessibilityControls from "./components/AccessibilityControls";
import Header from "./components/Header";
import ChatPrompt from "./components/ChatPrompt";

function App() {
  return (
    <div>
      
      {/* כותרת */}
      <Header />
      {/* תוכן ראשי */}
      <AccessibilityControls />
      <main style={{ padding: "20px" }}>
        {/* רכיב הצ'אט */}
        <ChatPrompt />
      </main>
    </div>
  );
}

export default App;
