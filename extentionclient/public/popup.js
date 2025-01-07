
import React from "react";
import ReactDOM from "react-dom";
import ChatPrompt from "./ChatPrompt";

ReactDOM.render(<ChatPrompt />, document.getElementById("root"));

document.getElementById("send-prompt").addEventListener("click", () => {
  const prompt = document.getElementById("prompt").value;

  chrome.runtime.sendMessage(
    { type: "send-prompt", prompt },
    (response) => {
      const responseElement = document.getElementById("response");
      if (response.success) {
        responseElement.textContent = response.data;
      } else {
        responseElement.textContent = `Error: ${response.error}`;
      }
    }
  );
});

document.getElementById("increase-font").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "adjust-font-size", size: "20px" });
  });
});

document.getElementById("decrease-font").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "adjust-font-size", size: "14px" });
  });
});

document.getElementById("toggle-contrast").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "toggle-contrast" });
  });
});
