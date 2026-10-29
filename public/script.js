const MIN_LENGTH = 200;
const MAX_LENGTH = 3000;
const DEMO_MODE = document.body.dataset.demoMode === "true";

const DEMO_EXAMPLES = {
  ai: {
    text: "Artificial intelligence is increasingly used to help people review large amounts of information, automate repetitive tasks, and identify patterns that might otherwise be missed. These systems can support work in education, healthcare, research, and software development. Their usefulness, however, depends on thoughtful implementation, reliable data, and continued human oversight. AI works best as a tool that strengthens human judgment rather than replacing it.",
    summary: "Artificial intelligence can reduce repetitive work and help people process information across many fields. Its value depends on reliable data, thoughtful implementation, and human oversight, making it most effective as a tool that supports rather than replaces human judgment."
  },
  climate: {
    text: "Climate researchers combine satellite observations, ocean measurements, historical records, and computer models to understand how the planet is changing. No single measurement explains the entire system, so scientists compare evidence collected across many regions and decades. This work helps communities anticipate risks such as extreme heat, flooding, and changing rainfall patterns while evaluating practical ways to reduce emissions and adapt infrastructure.",
    summary: "Climate scientists combine observations, historical records, and models to understand long-term planetary change. Their findings help communities anticipate climate risks, reduce emissions, and adapt infrastructure using evidence gathered across regions and decades."
  },
  writing: {
    text: "Finishing a first draft is less about producing a perfect manuscript than learning how a story behaves over time. Early chapters often reveal uncertainty in voice, pacing, and character, while later chapters show the writer making clearer decisions. Revising the work means preserving the strongest discoveries and removing material that no longer serves the story. Even a draft that is never published can become valuable practice for the next project.",
    summary: "A first draft helps writers discover their voice, pacing, and characters rather than produce immediate perfection. Revision preserves the strongest ideas and removes what no longer serves the story, making even unpublished work valuable preparation for future projects."
  }
};

const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const clearButton = document.getElementById("clear-button");
const copyButton = document.getElementById("copy-button");
const summarizedText = document.getElementById("summary");
const characterCount = document.getElementById("character-count");
const statusText = document.getElementById("status-text");
const readyState = document.querySelector(".ready-state");
const exampleButtons = [...document.querySelectorAll("[data-example]")];
const demoOnlyElements = document.querySelectorAll("[data-demo-only]");
const submitButtonText = submitButton.querySelector(".submit-button-text");

let selectedExample = DEMO_MODE ? "ai" : null;
let demoTimer;

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
  } else if (DEMO_MODE && selectedExample && textArea.value === DEMO_EXAMPLES[selectedExample].text) {
    setStatus("Example ready");
  } else if (DEMO_MODE) {
    setStatus("Custom text unavailable in demo mode");
  } else {
    setStatus("Ready to summarize");
  }
}

textArea.addEventListener("input", updateControls);

function selectExample(key) {
  selectedExample = key;
  textArea.value = DEMO_EXAMPLES[key].text;
  summarizedText.value = "";
  copyButton.disabled = true;

  exampleButtons.forEach((button) => {
    const selected = button.dataset.example === key;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", selected.toString());
  });

  updateControls();
}

exampleButtons.forEach((button) => {
  button.addEventListener("click", () => selectExample(button.dataset.example));
});

clearButton.addEventListener("click", () => {
  window.clearTimeout(demoTimer);
  selectedExample = null;
  textArea.value = "";
  summarizedText.value = "";
  copyButton.disabled = true;
  exampleButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });
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
    if (DEMO_MODE) {
      const example = selectedExample ? DEMO_EXAMPLES[selectedExample] : null;

      if (!example || textArea.value !== example.text) {
        throw new Error("Custom summarization isn’t available in the public demo. Choose an example above to preview the experience.");
      }

      await new Promise((resolve) => {
        demoTimer = window.setTimeout(resolve, 700);
      });

      summarizedText.value = example.summary;
      copyButton.disabled = false;
      setStatus("Summary complete");
      return;
    }

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

demoOnlyElements.forEach((element) => {
  element.hidden = !DEMO_MODE;
});

submitButtonText.textContent = DEMO_MODE ? "Summarize example" : "Summarize";

if (DEMO_MODE) {
  selectExample("ai");
} else {
  updateControls();
}
