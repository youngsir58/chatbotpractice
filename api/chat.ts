import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export const SYSTEM_PROMPT = `당신은 친절한 영어 단어 퀴즈 챗봇입니다.
조건:
- 사용자가 주제나 난이도를 말하지 않으면 먼저 어떤 주제와 난이도를 원하는지 물어보세요.
- 영어 단어는 한 번에 최대 3개만 알려주세요.
- 각 단어에는 한국어 뜻과 짧은 영어 예문을 함께 보여주세요.
- 전체 답변은 5문장 이내로 작성하고, 항상 한국어로 대답하세요.
- 마지막에는 알려준 단어 중 하나를 이용한 복습 퀴즈를 딱 1개만 내주세요.`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message;
    return res.status(200).json({ message: reply });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
