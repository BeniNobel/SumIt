# SumIt — AI Document Summarizer

SumIt is a minimal AI-powered web application that turns articles, essays, and other text into concise summaries using the Hugging Face BART model.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Run](#run)
- [Usage](#usage)
- [API Endpoint](#api-endpoint)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Demo

[Watch the SumIt demo](https://github.com/user-attachments/assets/667f397c-777d-4483-8bb2-2c53d87dfa3a)

## Features

- Single-request text summarization with `facebook/bart-large-cnn`
- Input validation from 200 to 3,000 characters
- Live character counting and limit feedback
- Clear, copy, loading, and error states
- Minimal monochrome interface
- Responsive desktop and mobile layouts
- Express API with server-side validation
- Automated boundary and request-payload tests

## Requirements

- Node.js 18 or newer
- npm
- A Hugging Face access token with Inference Providers permission

## Installation

Clone the repository and enter its directory:

```bash
git clone https://github.com/BeniNobel/SumIt.git
cd SumIt
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the repository root and add your Hugging Face access token:

```env
ACCESS_TOKEN=your_hugging_face_access_token
```

The `.env` file is ignored by Git and should never be committed.

## Run

Start the application:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For development with automatic server restarts:

```bash
npm run dev
```

## Usage

1. Paste between 200 and 3,000 characters into the document field.
2. Select **Summarize**.
3. Review or copy the generated summary.

SumIt intentionally uses one inference request per summary. The 3,000-character cap keeps natural-language input within a practical range for BART's context window without adding document chunking logic.

## API Endpoint

### `POST /summarize`

Accepts a JSON object containing `text_to_summarize` and returns the generated summary as plain text.

```bash
curl -X POST http://localhost:3000/summarize \
  -H "Content-Type: application/json" \
  -d '{"text_to_summarize":"Artificial intelligence can help people review large amounts of information quickly. Responsible tools support human judgment, reduce repetitive work, and make complex ideas easier to understand without replacing human oversight or careful review."}'
```

## Testing

Run the test suite:

```bash
npm test
```

The tests cover supported input boundaries and the Hugging Face request configuration without making external API calls.

## Project Structure

```text
SumIt/
├── public/
│   ├── index.html       # Application interface
│   ├── script.js        # Client-side interactions and API request
│   └── styles.css       # Minimal responsive styling
├── src/
│   ├── index.js         # Express server and API route
│   └── summarize.js     # Hugging Face summarization request
├── test/
│   └── summarize.test.js
├── package.json
└── README.md
```
