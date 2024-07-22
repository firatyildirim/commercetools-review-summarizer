import fetch from 'node-fetch';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import {
  ApiRoot,
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

const projectKey = 'kaantest';
const scopes = ['manage_project:kaantest'];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.eu-central-1.aws.commercetools.com',
  projectKey: projectKey,
  credentials: {
    clientId: 'jtv5QaPf1MAcrGyLkeXh6J2E',
    clientSecret: 'EgoGNxUYzfBeEi2kDr-c_WTPPx7IwKFF',
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.eu-central-1.aws.commercetools.com',
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient)
  .withProjectKey({ projectKey: projectKey });


//Placeholder method  
const getCustomers = async (apiRoot: ByProjectKeyRequestBuilder) => {
    return  apiRoot.customers().get().execute()
        .then(res => {
            return res.body.results;
        })
        .catch(err => { console.log("Error:", err) });
}

export const handler = async (event: any, context: any) => {
  try {

    // Customers query will be changed to get reviews query from Deniz
    const reviews = REVIEWS
  

    if (!reviews) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No reviews found.' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};


const REVIEWS =[
  {
      "review": "el tono de verde es precioso, no lo he usado para calor pero lo frío lo guarda durante mucho tiempo",
      "score": 5,
      "locale": "ES-MX"
  },
  {
      "review": "This is pricey for a tumbler, but for tumblers with quality from Stanley, Yeti, etc., it's worth the cost. I love the colour options (I bought 'Citron') and have been using it now for more than a month almost every morning during workdays. I make my own 'energy drink' and I like mine ice-cold and for it to remain that way while I am sipping. Unconventional, but due to my needs, I use this a bit like a shaker to mix up the energy-drink powder with ice, so it's def leak-proof unless you mess up (forgetting to close the flip-straw, not screwing the lid on tight enough, etc.). It is very sturdy, so essentially you get what you're paying for: quality! The smaller base is great, as this means you can easily fit this into your cupholder if you're on a road-trip. As for the handle, at first I was like 'does a tumbler really need a handle??'. The answer is: Yes, especially if you're on a road-trip and dealing with bags etc., it just makes it so much easier to carry it around.",
      "score": 5,
      "locale": "en-us"
  },
  {
      "review": "Er ist nun mein täglicher Begleiter! Seitdem trinke ich mehr als 3 Liter am Tag. Farbe und Verarbeitung sind top! Der Tumbler ist mega stabil und komplett auslaufsicher! Getränke sind sehr lange sehr kalt... zumindest, bis ich ihn leer getrunken habe. Ich empfehle ihn definitiv weiter und würde ihn immer wieder kaufen!",
      "score": 5,
      "locale": "GE-ger"
  },
  {
      "review": "Rien a dire, garde très bien le froid, pas encore essayer le chaud mais je conseille pour le sport",
      "score": 5,
      "locale": "fr-fr"
  },
  {
      "review": "Ürün sıcak içeceklere uygun değil bu bilgiyi de kolay bulamıyorsunuz, bir de ben aldıktan 1 hafta sonra da %30 indirime girmesi hoş olmadı",
      "score": 3,
      "locale": "tr-tr"
  },
  {
      "review": "J'en suis très contente, en plus d'être jolie elle est très pratique. Je bois beaucoup plus depuis que je l'ai. Elle ne fuit pas du tout. Le nettoyage est simple car la paille peut se retirer. La boisson reste fraîche assez longtemps. La poignée est très pratique.",
      "score": 5,
      "locale": "fr-fr"
  },
  {
      "review": "Bought this as a gift for my partner. Took it straight out of the box and noticed dirt and scrapes all over the tumblr. I would’ve let it slide if it was just one or two minor ones but it was ALL AROUND the bottom and on its base. Very disappointed",
      "score": 1,
      "locale": "en-us"
  }
]


