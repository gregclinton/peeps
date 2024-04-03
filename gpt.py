from openai import OpenAI
import secrets

client = OpenAI(api_key = secrets.get('OPENAI_API_KEY'))

def respond(chat):
    messages = [ {"role": "system", "content": "You are a helpful assistant."} ];

    for item in chat:
        for k, v in item.items():
            messages.append({'role': 'user' if k == 'prompt' else 'assistant', 'content': v});

    return client.chat.completions.create(
#       openai.com/pricing                context   $in/$out/M    trained
#       model = 'gpt-4-0125-preview',  #    128K       10/30      Dec '23
#       model = 'gpt-4',               #      8K       30/60      Sep '21
#       model = 'gpt-4-32k',           #     32K       60/120     Sep '21
        model = 'gpt-3.5-turbo-0125',  #      4K      0.5/1.5     Sep '21
        messages = messages
    ).choices[0].message.content