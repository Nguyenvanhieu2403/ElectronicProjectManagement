import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  isOpen = false;
  messages: { sender: string; text: string }[] = [];
  newMessage = '';
  sendMessageAI = '';
  isTyping = false;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages.push({
      sender: 'EAUT Bot',
      text: 'Xin chào, Tôi có thể giúp gì cho bạn hôm nay?',
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    // Add user message to chat
    this.messages.push({ sender: 'You', text: this.newMessage });
    this.sendMessageAI = this.newMessage;
    this.newMessage = '';
    this.isTyping = true;
    this.messages.push({ sender: 'EAUT Bot', text: '' });

    try {
      // Gửi API và lấy phản hồi từ chatbot
      const response = await this.chatService.sendMessage(this.sendMessageAI);

      // Xóa "..." trước khi thêm câu trả lời thật
      this.messages.pop();
      this.messages.push({ sender: 'EAUT Bot', text: response });
    } finally {
      this.isTyping = false;
    }

  }

}
