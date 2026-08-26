const MIN_LENGTH = 200;
const MAX_LENGTH = 3000;

const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const clearButton = document.getElementById("clear-button");
const copyButton = document.getElementById("copy-button");
const summarizedText = document.getElementById("summary");
const characterCount = document.getElementById("character-count");
const statusText = document.getElementById("status-text");
const readyState = document.querySelector(".ready-state");

function setStatus(message, state = "ready") {
  statusText.textContent = message;
  readyState.classList.toggle("is-working", state === "working");
  readyState.classList.toggle("is-error", state === "error");
}

function updateControls() {
  const length = textArea.value.length;
  const validLength = length >= MIN_LENGTH && length <= MAX_LENGTH;

  characterCount.textContent = `${length.toLocaleString()} ${length === 1 ? "character" : "characters"}`;
  submitButton.disabled = !validLength;
  clearButton.disabled = length === 0;

  if (length === 0) {
    setStatus("Ready when you are");
  } else if (length < MIN_LENGTH) {
    setStatus(`${MIN_LENGTH - length} more characters needed`);
  } else if (length > MAX_LENGTH) {
    setStatus(`${(length - MAX_LENGTH).toLocaleString()} characters over the limit`, "error");
  } else {
    setStatus("Ready to summarize");
  }
}

textArea.addEventListener("input", updateControls);

clearButton.addEventListener("click", () => {
  textArea.value = "";
  summarizedText.value = "";
  copyButton.disabled = true;
  updateControls();
  textArea.focus();
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(summarizedText.value);
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1600);
  } catch {
    summarizedText.select();
    setStatus("Select and copy the summary manually", "error");
  }
});

submitButton.addEventListener("click", async () => {
  submitButton.classList.add("submit-button--loading");
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  copyButton.disabled = true;
  setStatus("Creating your summary…", "working");

  try {
    const response = await fetch("/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_to_summarize: textArea.value })
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || `Request failed with status ${response.status}`);
    }

    summarizedText.value = responseText;
    copyButton.disabled = summarizedText.value.length === 0;
    setStatus("Summary complete");
  } catch (error) {
    summarizedText.value = error.message || "We couldn't create a summary. Please try again.";
    setStatus("Couldn’t summarize this document", "error");
    console.error(error);
  } finally {
    submitButton.classList.remove("submit-button--loading");
    submitButton.removeAttribute("aria-busy");
    submitButton.disabled = textArea.value.length < MIN_LENGTH || textArea.value.length > MAX_LENGTH;
  }
});

updateControls();
