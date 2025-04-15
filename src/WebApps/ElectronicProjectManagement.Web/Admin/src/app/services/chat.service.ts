import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from "openai";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private chat: any;

  constructor() {
    const apiKey = 'AIzaSyC91v5gMwErn5FEYRFjt2ZxyxccvTdVkTY'; // Thay bằng API key của bạn
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async initializeChat() {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `
          Bạn là một chatbot chuyên hỗ trợ về Trường Đại học Công nghệ Đông Á (EAUT).` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Đã hiểu! Tôi sẽ chỉ trả lời về Trường Đại học Công nghệ Đông Á và luôn hiểu "trường" là Trường Đại học Công nghệ Đông Á  khi có câu hỏi liên quan.' }],
        },
      ],
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      await this.initializeChat();
    }
    const result = await this.chat.sendMessageStream(message);
    let response = '';
    for await (const chunk of result.stream) {
      response += chunk.text();
    }
    return response;
  }

}
