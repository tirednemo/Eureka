import {GEMINI_API_KEY} from '@env';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {ChatHistoryType} from '../../App';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const askGemini = async ({
  query,
  history,
}: {
  query: string;
  history: ChatHistoryType;
}) => {
  const model = genAI.getGenerativeModel({model: 'gemini-pro'});
  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(query);

  const response = result.response;
  return response.text();
};

export const askGemma = async ({query}: {query: string}) => {
  const response = await fetch('https://9c67-34-127-65-114.ngrok-free.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: query,
    }),
  });

  return response.text();
};
