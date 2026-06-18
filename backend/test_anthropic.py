import os
import sys
import traceback

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    # dotenv optional; continue if not available
    pass

try:
    import anthropic
except Exception as e:
    print('Import error:', e)
    sys.exit(2)

api_key = os.getenv('ANTHROPIC_API_KEY')
if not api_key:
    print('ANTHROPIC_API_KEY not set')
    sys.exit(3)

try:
    client = anthropic.Anthropic(api_key=api_key)
    resp = client.messages.create(
        model='claude-sonnet-4-6',
        max_tokens=150,
        system="Tu es un assistant court et poli.",
        messages=[{"role":"user","content":"Bonjour, peux-tu répondre brièvement ?"}],
    )
    print('API call successful. Response preview:')
    try:
        text = getattr(resp, 'content', None)
        if text:
            print(text)
        else:
            print(resp)
    except Exception:
        print(resp)
except Exception:
    print('Error during API call:')
    traceback.print_exc()
    sys.exit(1)
