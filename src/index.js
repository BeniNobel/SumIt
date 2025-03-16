import express from 'express';
import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
import summarize from './summarize.js';
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
        const response = await summarize(text);

        res.send(response);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while summarizing the text.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});