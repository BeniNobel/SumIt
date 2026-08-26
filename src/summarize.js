import axios from 'axios';

export const MIN_TEXT_LENGTH = 200;
export const MAX_TEXT_LENGTH = 3000;

async function summarize(text) {
    if (typeof text !== 'string' || text.trim().length < MIN_TEXT_LENGTH || text.length > MAX_TEXT_LENGTH) {
        throw new Error(`Text must be between ${MIN_TEXT_LENGTH} and ${MAX_TEXT_LENGTH} characters.`);
    }

    const data = JSON.stringify({
        inputs: text,
        parameters: {
            max_length: 100,
            min_length: 30
        }
    });

    const config = {
        method: 'post',
        url: 'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        },
        data
    };

    try {
        const response = await axios.request(config);
        return response.data[0].summary_text;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error('The summarization service could not process this text.');
    }
}

export default summarize;
