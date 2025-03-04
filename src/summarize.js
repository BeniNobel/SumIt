<<<<<<< HEAD
import axios from 'axios';

// This is the function where the call to the API is made. Returns the summarized text as a string.
async function summarize(text) {
    let data = JSON.stringify({
        "inputs": text,
        "parameters": {
          "max_length": 100,
          "min_length": 30
        }
    });

    let config = {
        method: 'post',
        url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
        },
        data: data
      };

    try {
        const response = await axios.request(config);
        return response.data[0].summary_text;
    } catch (err) {
        console.log(err);
        throw new Error('An error occurred while summarizing the text.');
    }
}

// Export the summarize function
=======
import axios from 'axios';

// This is the function where the call to the API is made. Returns the summarized text as a string.
async function summarize(text) {
    let data = JSON.stringify({
        "inputs": text,
        "parameters": {
          "max_length": 100,
          "min_length": 30
        }
    });

    let config = {
        method: 'post',
        url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
        },
        data: data
      };

    try {
        const response = await axios.request(config);
        return response.data[0].summary_text;
    } catch (err) {
        console.log(err);
        throw new Error('An error occurred while summarizing the text.');
    }
}

// Export the summarize function
>>>>>>> b4c5c3b4dc20e2b373c5f7cb747e390fdb058d0a
export default summarize;