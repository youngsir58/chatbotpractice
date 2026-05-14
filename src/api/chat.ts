export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToApi = async (messages: Message[]): Promise<Message> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'API request failed');
  }

  const data = await response.json();
  return data.message;
};
