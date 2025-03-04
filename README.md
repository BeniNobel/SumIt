# SummarizeIt

SummarizeIt is a web application that leverages AI technology to summarize long texts. Using the Hugging Face BART model, SummarizeIt provides an efficient way to condense large articles, research papers, or other lengthy documents into a concise summary. This is ideal for users who are short on time but need to quickly understand key points from a piece of text.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoint](#api-endpoint)
- [Usage](#usage)
- [Video Demo](#video-demo)

## Features

- **Text Summarization**: Paste any text (min 200 characters, max 100,000 characters) into the input area, and get a concise summary of the key points.
- **Responsive Design**: The app adapts to different screen sizes, ensuring an optimal user experience on both desktop and mobile devices.
- **Error Handling**: The app gracefully handles errors such as invalid text input or issues with the summarization API.

## Technologies Used

- **Frontend**:
  - HTML, CSS, JavaScript (ES6)
  - Fetch API for making HTTP requests
- **Backend**:
  - Node.js, Express
  - Axios for making API calls to Hugging Face
  - dotenv for environment variable management
- **API**: Hugging Face BART large CNN model for text summarization

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/BeniNobel/summarizeit.git
   cd summarizeit

2. Install dependencies:

   ```bash
   npm install

3. Create a `.env` file and add your Hugging Face API key:
   ```bash
   ACCESS_TOKEN=your_huggingface_api_key

4. Start the server:
   ```bash
   npm start

5. Open your browser and navigate to `http://localhost:3000`.

## API Endpoint

- `POST /summarize`: Accepts a `text_to_summarize` parameter in the request body and returns a summarized version of the input text.

### Example Request

```bash
curl -X POST http://localhost:3000/summarize \
-H "Content-Type: application/json" \
-d '{"text_to_summarize": "Your long text here."}'
```

## Usage

1. Paste your text into the provided text area (min 200 characters, max 100,000 characters).
2. Click "Summarize" to get a concise summary.
3. The summarized text will appear in the output box.

## Video Demo

>>>>>>> b4c5c3b4dc20e2b373c5f7cb747e390fdb058d0a
[https://github.com/BeniNobel/SummarizeIt/demo.mp4](https://github.com/user-attachments/assets/c62848a9-4f68-4990-a738-6cc64b859ead)