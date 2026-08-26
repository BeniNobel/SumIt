import test from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import summarize, { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from '../src/summarize.js';

test('accepts text at the supported boundaries', async (t) => {
    t.mock.method(axios, 'request', async () => ({
        data: [{ summary_text: 'A concise summary.' }]
    }));

    assert.equal(await summarize('a'.repeat(MIN_TEXT_LENGTH)), 'A concise summary.');
    assert.equal(await summarize('a'.repeat(MAX_TEXT_LENGTH)), 'A concise summary.');
});

test('rejects text outside the supported boundaries', async () => {
    await assert.rejects(() => summarize('a'.repeat(MIN_TEXT_LENGTH - 1)), /between 200 and 3000/);
    await assert.rejects(() => summarize('a'.repeat(MAX_TEXT_LENGTH + 1)), /between 200 and 3000/);
});

test('sends the expected payload to the current Hugging Face endpoint', async (t) => {
    let requestConfig;

    t.mock.method(axios, 'request', async (config) => {
        requestConfig = config;
        return { data: [{ summary_text: 'A concise summary.' }] };
    });

    await summarize('Natural prose for testing. '.repeat(10));

    assert.equal(
        requestConfig.url,
        'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn'
    );
    assert.deepEqual(JSON.parse(requestConfig.data).parameters, {
        max_length: 100,
        min_length: 30
    });
});
