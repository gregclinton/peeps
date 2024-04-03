import anthropic
import secrets

client = anthropic.Anthropic(api_key = secrets.get('ANTHROPIC_API_KEY'))

def prompt(messages):
    return client.messages.create(
    #   anthropic.com/news/claude-3-family      context   $in/$out/M    trained
        model = 'claude-3-haiku-20240307',   #            0.25/1.25
    #   model = 'claude-3-sonnet-20240229',  #               3/15
    #   model = 'claude-3-opus-20240229',    #              15/75
        max_tokens = 1000,
        temperature = 0.0,
        system = "You are a helpful assistant.",
        messages = [
            { "role": "user", "content": text }
        ]
    ).content[0].text