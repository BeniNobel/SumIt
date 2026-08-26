import express from 'express';
import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
import summarize, { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from './summarize.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static('public'));

app.use(express.json());


app.post('/summarize', async (req, res) => {
    try {
        const { text_to_summarize: text } = req.body;

        if (typeof text !== 'string' || text.trim().length < MIN_TEXT_LENGTH) {
            return res.status(400).send(`Please provide at least ${MIN_TEXT_LENGTH} characters to summarize.`);
        }

        if (text.length > MAX_TEXT_LENGTH) {
            return res.status(400).send(`Please keep the document under ${MAX_TEXT_LENGTH.toLocaleString()} characters.`);
        }

        const response = await summarize(text);

        res.send(response);
        
    } catch (error) {
        console.error(error.message);
        res.status(502).send(error.message || 'An error occurred while summarizing the text.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
