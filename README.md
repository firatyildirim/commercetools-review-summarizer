
# ChatGPT Prompts

I've generated 2 different prompt. One of them created by human and the other one created by ChatGPT's self. Basicly both have same sections in it. 

- Defining the example input.
- Defining what you want from the given input.
- Defining the example output.

## Human version:

```
You are a bot designed to process and summarize product reviews given in the form of a JSON object. Given the JSON object below, you must analyze the comments to create a brief summary.

Example JSON Object:

[
  {
	"score": 4,
	"date": "12-04-2024",
	"comment": "Ömürlük bir ürün. İnanılmaz süreler sıcak ve soğuk tutuyor. Her sene farklı markalardan işe yaramayan termos almaktansa tek seferde buna para verin :)",
	"locale": "tr-TR"
  }
]

Summarize these comments into three categories: “common positive comment”, “common negative comments”, “notable observation”. The summaries shouldn't exceed 3 sentences.

Translate the generated summaries to these languages [tr-TR, en-US, fr-FR, de-DE, nl-NL].

Do not take any discriminative, rude and bad comments to summary as a parameter.

The output must be a JSON object as shown below, with "average-score" as a floating number with two decimal points and all other values as strings:

{
	"average-score": double .2f,
	"summary": "string",
	"common-positive": {
		"tr-TR": "string",
		"en-US": "string",
		"fr-FR": "string",
		"de-DE": "string",
		"nl-NL": "string"
	},
	"common-negative": {
		"tr-TR": "string",
		"en-US": "string",
		"fr-FR": "string",
		"de-DE": "string",
		"nl-NL": "string"
	},
	"noteable-observation": {
		"tr-TR": "string",
		"en-US": "string",
		"fr-FR": "string",
		"de-DE": "string",
		"nl-NL": "string"
	}
}

Remember, the output must be a valid JSON object.
```

For the first one, we tried the prompt in 5 models using EPAM dial. Lama 3, ChatGPT4, Gemini Pro, ChatGPT3.5 Turbo. The best performance that we achived was ChatGPT3.5


### Example Output Of First Prompt

```
{
  "average-score": 4.00,
  "summary": "The product is highly praised for its ability to maintain temperature for a long time, recommended as a one-time quality investment.",
  "common-positive": {
    "tr-TR": "İnanılmaz süreler sıcak ve soğuk tutuyor.",
    "en-US": "Keeps hot and cold for incredible durations.",
    "fr-FR": "Garde le chaud et le froid pendant des durées incroyables.",
    "de-DE": "Hält heiße und kalte Temperaturen unglaublich lange.",
    "nl-NL": "Houdt warmte en kou ongelooflijk lang vast."
  },
  "common-negative": {
    "tr-TR": "Negatif bir yorum yok.",
    "en-US": "No negative comments.",
    "fr-FR": "Aucun commentaire négatif.",
    "de-DE": "Keine negativen Kommentare.",
    "nl-NL": "Geen negatieve opmerkingen."
  },
  "noteable-observation": {
    "tr-TR": "Ömürlük bir ürün, tek seferde para verin.",
    "en-US": "A lifetime product, worth the one-time investment.",
    "fr-FR": "Un produit à vie, vaut l'investissement unique.",
    "de-DE": "Ein lebenslanges Produkt, das die einmalige Investition wert ist.",
    "nl-NL": "Een product voor het leven, de eenmalige investering waard."
  }
}
```
## ChatBot Version:

This prompt created by ChatGpt's self. This prompts also contains same sections.

```

You are an advanced AI designed to summarize customer reviews. You will receive a JSON array containing reviews in various languages, along with their scores and locales. Your task is to read all the reviews, including those not in English, and generate a coherent and concise summary in English, Turkish, and German that reflects the overall sentiment and key points from the reviews.

Here is the structure of the JSON array you will process:

[
    {
        \"review\": \"el tono de verde es precioso, no lo he usado para calor pero lo frío lo guarda durante mucho tiempo\",
        \"score\": 5,
        \"locale\": \"ES-MX\"
    },
    {
        \"review\": \"This is pricey for a tumbler, but for tumblers with quality from Stanley, Yeti, etc., it's worth the cost. I love the colour options (I bought 'Citron') and have been using it now for more than a month almost every morning during workdays. I make my own 'energy drink' and I like mine ice-cold and for it to remain that way while I am sipping. Unconventional, but due to my needs, I use this a bit like a shaker to mix up the energy-drink powder with ice, so it's def leak-proof unless you mess up (forgetting to close the flip-straw, not screwing the lid on tight enough, etc.). It is very sturdy, so essentially you get what you're paying for: quality! The smaller base is great, as this means you can easily fit this into your cupholder if you're on a road-trip. As for the handle, at first I was like 'does a tumbler really need a handle??'. The answer is: Yes, especially if you're on a road-trip and dealing with bags etc., it just makes it so much easier to carry it around.\",
        \"score\": 5,
        \"locale\": \"en-us\"
    },
    {
        \"review\": \"Er ist nun mein täglicher Begleiter! Seitdem trinke ich mehr als 3 Liter am Tag. Farbe und Verarbeitung sind top! Der Tumbler ist mega stabil und komplett auslaufsicher! Getränke sind sehr lange sehr kalt... zumindest, bis ich ihn leer getrunken habe. Ich empfehle ihn definitiv weiter und würde ihn immer wieder kaufen!\",
        \"score\": 5,
        \"locale\": \"GE-ger\"
    },
    {
        \"review\": \"Rien a dire, garde très bien le froid, pas encore essayer le chaud mais je conseille pour le sport\",
        \"score\": 5,
        \"locale\": \"fr-fr\"
    },
    {
        \"review\": \"Ürün sıcak içeceklere uygun değil bu bilgiyi de kolay bulamıyorsunuz, bir de ben aldıktan 1 hafta sonra da %30 indirime girmesi hoş olmadı\",
        \"score\": 3,
        \"locale\": \"tr-tr\"
    },
    {
        \"review\": \"J'en suis très contente, en plus d'être jolie elle est très pratique. Je bois beaucoup plus depuis que je l'ai. Elle ne fuit pas du tout. Le nettoyage est simple car la paille peut se retirer. La boisson reste fraîche assez longtemps. La poignée est très pratique.\",
        \"score\": 5,
        \"locale\": \"fr-fr\"
    },
    {
        \"review\": \"Bought this as a gift for my partner. Took it straight out of the box and noticed dirt and scrapes all over the tumblr. I would’ve let it slide if it was just one or two minor ones but it was ALL AROUND the bottom and on its base. Very disappointed\",
        \"score\": 1,
        \"locale\": \"en-us\"
    }
]

Please analyze the reviews, taking into account the scores and locales, and provide a summary. Consider the following aspects:
1. Overall sentiment of the reviews.
2. Commonly mentioned positive points.
3. Commonly mentioned negative points (if any).
4. Any notable observations or unique comments.

Your response should be in the following JSON format:

{
    \"average-score\": number,
    \"summary\": \"text\",
    \"common-positive\": {
        \"tr-TR\": \"tr version of summary\",
        \"en-US\": \"en version of summary\",
        \"fr-FR\": \"fr version of summary\",
        \"de-DE\": \"de version of summary\",
        \"nl-NL\": \"nl version of summary\"
    },
    \"common-negative\": {
        \"tr-TR\": \"tr version of summary\",
        \"en-US\": \"en version of summary\",
        \"fr-FR\": \"fr version of summary\",
        \"de-DE\": \"de version of summary\",
        \"nl-NL\": \"nl version of summary\"
    },
    \"noteable-observation\": {
        \"tr-TR\": \"tr version of summary\",
        \"en-US\": \"en version of summary\",
        \"fr-FR\": \"fr version of summary\",
        \"de-DE\": \"de version of summary\",
        \"nl-NL\": \"nl version of summary\"
    }
}

Generate the summaries now."

```

We tried in 5 difference models. Lama 3, ChatGPT4, Gemini Pro, ChatGPT3.5 Turbo. We almost got the same output all of them.

### Example Output Of Second Prompt (Gemini Pro): 

```
{
    "average-score": 4.6,
    "summary": "The overall sentiment towards the product is positive. Customers appreciate the quality, sturdiness, and leak-proof design of the tumbler. They also praise its ability to keep drinks cold for a long time. However, some customers have noted that the tumbler is not suitable for hot beverages and that it can be expensive. There was also one instance of a customer receiving a damaged product.",
    "common-positive": {
        "tr-TR": "Müşteriler ürünün kalitesini, sağlamlığını ve sızdırmaz tasarımını beğeniyor. Ayrıca içecekleri uzun süre soğuk tutabilme özelliğini de övüyorlar.",
        "en-US": "Customers appreciate the quality, sturdiness, and leak-proof design of the tumbler. They also praise its ability to keep drinks cold for a long time.",
        "fr-FR": "Les clients apprécient la qualité, la robustesse et la conception anti-fuite du gobelet. Ils saluent également sa capacité à garder les boissons froides pendant longtemps.",
        "de-DE": "Kunden schätzen die Qualität, Robustheit und das auslaufsichere Design des Bechers. Außerdem loben sie seine Fähigkeit, Getränke lange kalt zu halten.",
        "nl-NL": "Klanten waarderen de kwaliteit, stevigheid en lekvrije ontwerp van de beker. Ze prijzen ook zijn vermogen om dranken lang koud te houden."
    },
    "common-negative": {
        "tr-TR": "Bazı müşteriler ürünün sıcak içecekler için uygun olmadığını ve pahalı olabileceğini belirtti. Ayrıca bir müşteri hasarlı bir ürün aldığını bildirdi.",
        "en-US": "Some customers have noted that the tumbler is not suitable for hot beverages and that it can be expensive. There was also one instance of a customer receiving a damaged product.",
        "fr-FR": "Certains clients ont noté que le gobelet ne convient pas aux boissons chaudes et qu'il peut être cher. Un client a également signalé avoir reçu un produit endommagé.",
        "de-DE": "Einige Kunden haben angemerkt, dass der Becher nicht für heiße Getränke geeignet ist und dass er teuer sein kann. Es gab auch einen Fall, in dem ein Kunde ein beschädigtes Produkt erhalten hat.",
        "nl-NL": "Sommige klanten hebben opgemerkt dat de beker niet geschikt is voor warme dranken en dat hij duur kan zijn. Er was ook één geval waarin een klant een beschadigd product ontving."
    },
    "noteable-observation": {
        "tr-TR": "Ürün soğuk içecekler için oldukça popüler görünüyor ve spor yapanlar tarafından tercih ediliyor.",
        "en-US": "The product seems to be quite popular for cold drinks and is preferred by people who exercise.",
        "fr-FR": "Le produit semble être très populaire pour les boissons froides et est apprécié par les sportifs.",
        "de-DE": "Das Produkt scheint sehr beliebt für kalte Getränke zu sein und wird von Sportlern bevorzugt.",
        "nl-NL": "Het product lijkt erg populair te zijn voor koude dranken en wordt geprefereerd door mensen die sporten."
    }
}

```

### Conclusion

In general we got the best performance using ChatGPT3.5. Other versions sometimes creates unexpected outputs. For example instead of json they may create text only. Prompts must be clear and define every detail about outputs exactly.
