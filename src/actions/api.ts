import {ChatHistoryType} from '../../App';

export const askGemini = async ({
  query,
  history,
}: {
  query: string;
  history: ChatHistoryType;
}) => {
  const response = await fetch(
    'https://lynx-relaxed-similarly.ngrok.free.app/gemini',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: query,
        history: history,
      }),
    },
  );

  return response.text();
};

export const askGemma = async ({query}: {query: string}) => {
  const response = await fetch(
    'https://lynx-relaxed-similarly.ngrok.free.app/gemma',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: query,
      }),
    },
  );

  return response.text();
};
