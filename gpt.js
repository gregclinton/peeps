console.log('hi hi hi');

/*

curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "user", "content": "Say this is a test!"}],
     "temperature": 0.7
   }'

*/

fetch('/v1/chat/completions/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + secrets.openaiApiKey
    } ,
    body: JSON.stringify({
        messages: [{"role": "user", "content": "Say this is a test!"}],
        model: 'gpt-3.5-turbo',
        temperature: 0.7
    })
});