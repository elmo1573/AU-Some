async function askAssistant({
  message,
  subject = "General",
  format = "Easy Explanation",
  module = "hub",
  triggerContext,
}) {
  const res = await fetch("/api/assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, subject, format, module, triggerContext }),
  });

  const data = await res.json();
  return data.answer || data.responseText || "I'm here with you. Let's take it one step at a time.";
}
