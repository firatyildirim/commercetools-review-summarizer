import { APIGatewayProxyHandler } from "aws-lambda";
import axios from 'axios';

const chatGptApiKey = 'YOUR_CHATGPT_API_KEY';
const chatGptApiUrl = 'https://api.openai.com/v1/completions';

export const handler: APIGatewayProxyHandler = async (event: any) => {
  const reviews = JSON.parse(event.body);


  try {
    const response = await axios.post(chatGptApiUrl, {
      prompt: `Analyze the following reviews: ${reviews}`,
      max_tokens: 100,
      model: 'text-davinci-003',
    }, {
      headers: {
        'Authorization': `Bearer ${chatGptApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const analysis = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify(analysis),
    };
  } catch (error : any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
