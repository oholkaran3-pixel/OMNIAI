import requests

URL = "http://127.0.0.1:8000/chat/stream"

languages = [
    ("en-IN", "English"),
    ("hi-IN", "Hindi"),
    ("bn-IN", "Bengali"),
    ("ta-IN", "Tamil"),
    ("te-IN", "Telugu"),
    ("kn-IN", "Kannada"),
    ("ml-IN", "Malayalam"),
    ("mr-IN", "Marathi"),
    ("gu-IN", "Gujarati"),
    ("pa-IN", "Punjabi"),
    ("ur-IN", "Urdu"),
    ("or-IN", "Odia"),
    ("as-IN", "Assamese"),
    ("sa-IN", "Sanskrit"),

    ("es-ES", "Spanish"),
    ("fr-FR", "French"),
    ("de-DE", "German"),
    ("it-IT", "Italian"),
    ("pt-BR", "Portuguese"),
    ("ru-RU", "Russian"),
    ("uk-UA", "Ukrainian"),
    ("pl-PL", "Polish"),
    ("nl-NL", "Dutch"),
    ("sv-SE", "Swedish"),
    ("da-DK", "Danish"),
    ("no-NO", "Norwegian"),
    ("fi-FI", "Finnish"),
    ("el-GR", "Greek"),
    ("tr-TR", "Turkish"),
    ("cs-CZ", "Czech"),
    ("ro-RO", "Romanian"),
    ("hu-HU", "Hungarian"),

    ("ar-SA", "Arabic"),
    ("fa-IR", "Persian"),
    ("he-IL", "Hebrew"),
    ("az-AZ", "Azerbaijani"),
    ("kk-KZ", "Kazakh"),
    ("uz-UZ", "Uzbek"),

    ("zh-CN", "Mandarin"),
    ("zh-TW", "Traditional Chinese"),
    ("ja-JP", "Japanese"),
    ("ko-KR", "Korean"),
    ("mn-MN", "Mongolian"),

    ("id-ID", "Indonesian"),
    ("ms-MY", "Malay"),
    ("th-TH", "Thai"),
    ("vi-VN", "Vietnamese"),
    ("tl-PH", "Filipino"),

    ("sw-KE", "Swahili"),
    ("yo-NG", "Yoruba"),
    ("zu-ZA", "Zulu"),
    ("af-ZA", "Afrikaans"),

    ("la", "Latin"),
    ("grc", "Ancient Greek"),
    ("eo", "Esperanto"),
    ("tlh", "Klingon"),
    ("qya", "Quenya"),
]

for code, name in languages:

    print(f"\nTESTING: {name} ({code})")

    try:
        response = requests.post(
            URL,
            json={
                "message": "What is Python?",
                "language": code,
            },
            timeout=60,
        )

        if response.status_code == 200:
            answer = response.text.strip()

            if answer:
                print("✅ OK")
                print(answer[:300])
            else:
                print("⚠️ EMPTY")

        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(response.text[:300])

    except requests.exceptions.Timeout:
        print("⏱️ TIMEOUT")

    except Exception as error:
        print(f"❌ ERROR: {error}")

print("\n" + "=" * 60)
print("ALL LANGUAGE TESTS FINISHED")
print("=" * 60)