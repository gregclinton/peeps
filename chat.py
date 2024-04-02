from openai import OpenAI

keys = dict(line.split(',') for line in open('api_keys').read().splitlines())
client = OpenAI(api_key = keys['OPENAI_API_KEY'])

def haiku():
    completion = client.chat.completions.create(
    #   openai.com/pricing                context   $in/$out/M    trained
    #   model = 'gpt-4-0125-preview',  #    128K       10/30      Dec '23
    #   model = 'gpt-4',               #      8K       30/60      Sep '21
    #   model = 'gpt-4-32k',           #     32K       60/120     Sep '21
        model = 'gpt-3.5-turbo-0125',  #      4K      0.5/1.5     Sep '21
        messages = [
            {"role": "system", "content": "You are a poetic assistant."},
            {"role": "user", "content": "Compose a haiku that explains relativity."}
        ]
    )

    return completion.choices[0].message.content
