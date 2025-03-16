const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedText = document.getElementById("summary");

submitButton.disabled = true;

textArea.addEventListener("input", (e) => {
    const textarea = e.target;

    if (textarea.value.length > 200 && textarea.value.length < 100000) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
});

submitButton.addEventListener("click", async () => {
    // Start the spinning loading animation
    submitButton.classList.add("submit-button--loading");
    const text_to_summarize = textArea.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "text_to_summarize": text_to_summarize
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch('/summarize', requestOptions);
        const summary = await response.text();

        summarizedText.value = summary;

    } catch (error) {
        console.log('Error:', error.message);

    } finally {
        // Stop the spinning loading animation
        submitButton.classList.remove("submit-button--loading");
    }
});