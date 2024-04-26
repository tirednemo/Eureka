import {ChatHistoryType} from '../../App';

export const askGemini = async ({
  query,
  history,
}: {
  query: string;
  history: ChatHistoryType;
}) => {
  const response = await fetch(
    'https://7e2f-35-204-208-209.ngrok-free.app/gemini',
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
    'https://7e2f-35-204-208-209.ngrok-free.app/gemma',
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
