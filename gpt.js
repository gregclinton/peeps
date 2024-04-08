/// https://platform.openai.com/docs/api-reference/introduction

fetch('/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + secrets.openaiApiKey,
        'Content-Type': 'application/json'
    } ,
    body: JSON.stringify({
        messages: [{"role": "user", "content": "Say this is a test!"}],
        model: 'gpt-3.5-turbo',
        temperature: 0.7
    })
});