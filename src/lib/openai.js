// src/lib/openai.js
import OpenAI from "openai";

// Инициализируем клиента OpenAI с API ключом
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askOpenAI(prompt, userDopamine) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
      n: 1,
      stop: null,
    });

    // Добавляем проверку, чтобы избежать ошибки
    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    } else {
      // Возвращаем сообщение об ошибке, если API не дал ответа
      console.error("OpenAI API returned an empty response.");
      return "Извините, Акылман не смог найти ответа. Пожалуйста, повторите вопрос.";
    }

  } catch (error) {
    // Обрабатываем другие возможные ошибки
    console.error("Ошибка при запросе к OpenAI:", error.response ? error.response.data : error.message);
    return "Извините, возникла техническая неполадка. Пожалуйста, попробуйте позже.";
  }
}