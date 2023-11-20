import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../services/socket.service';

const API_URL = 'https://goldfish-app-67lk9.ondigitalocean.app/api/test/';
const API_URL2 = 'https://goldfish-app-67lk9.ondigitalocean.app/api/chat';

export interface ChatSession {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  // Obtener las sesiones de chat asociadas al taller
  getChatSessions(userId: string): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(API_URL2 + `/chatsessions/${userId}`);
  }

  // Obtener mensajes de una sesión de chat
  getMessagesForSession(sessionId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      API_URL2 + `/chatmessages/${sessionId}`
    );
  }

  // Nueva función para obtener sesiones por experto
  getSessionsForExpert(expertId: string): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(
      API_URL2 + `/sessions?expertId=${expertId}`
    );
  }

  getActiveUnreadSessionsForExpert(
    expertId: string
  ): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(API_URL2 + `/unread`, {
      params: { expertId },
    });
  }
}
