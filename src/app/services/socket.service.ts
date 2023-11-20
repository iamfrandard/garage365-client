import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const API_URL2 = 'http://localhost:8080/api/chat';

export interface ChatMessage {
  _id?: string;
  sessionId?: string;
  content: string;
  timestamp: Date;
  createdAt?: Date;
  sender?: string;
  tallerId?: string;
  userId?: string;
  responded?: boolean;
  userName?: string;
  tallerName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private newMessageSubject = new Subject<ChatMessage>();
  newMessage$ = this.newMessageSubject.asObservable();

  private socket: any;
  private readonly endpoint: string = 'http://localhost:8080';
  private sessionId!: string;

  constructor(private http: HttpClient) {
    this.socket = io(this.endpoint); // Conéctate al servidor donde se encuentra tu backend

    // Escuchar el evento 'session' desde el servidor para obtener el sessionId
    this.socket.on('session_id', (id: string) => {
      this.sessionId = id;
    });
  }

  emitNewMessageEvent(message: ChatMessage) {
    this.newMessageSubject.next(message);
  }

  // Método para enviar mensajes al servidor
  sendMessage(message: ChatMessage): void {
    this.socket.emit('send_message', message);
  }

  // Método para escuchar mensajes desde el servidor
  public getMessages(): Observable<ChatMessage> {
    return new Observable((observer) => {
      this.socket.on('new_message', (message: ChatMessage) => {
        observer.next(message);
      });
    });
  }

  isConnected(): boolean {
    return this.socket.connected;
  }

  // Unirse a una sala de chat específica (sesión)
  joinSession(sessionId: string) {
    this.socket.emit('join_session', sessionId);
  }

  // Dejar una sala de chat específica (sesión)
  leaveSession(sessionId: string) {
    this.socket.emit('leave_taller', sessionId);
  }

  // Método para obtener el sessionId actual
  getCurrentSessionId(): string | undefined {
    return this.sessionId;
  }

  joinTallerRoom(
    tallerId: string,
    userId: string,
    userName: string,
    tallerName: string
  ) {
    const data = {
      tallerId,
      userId,
      userName,
      tallerName,
    };
    this.socket.emit('join_taller', data);
  }

  getSessionId(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('session_id', (sessionId: string) => {
        observer.next(sessionId);
      });
    });
  }

  getSessionIdForList(): Observable<{ _id: string; isNewSession: boolean }> {
    return new Observable<{ _id: string; isNewSession: boolean }>(
      (observer) => {
        this.socket.on(
          'session',
          (sessionData: { _id: string; isNewSession: boolean }) => {
            observer.next(sessionData);
          }
        );
      }
    );
  }
  leaveTallerRoom(tallerId: string) {
    this.socket.emit('leave_taller', tallerId);
  }

  onNewMessage() {
    return new Observable((observer) => {
      this.socket.on('new_message', (message: ChatMessage) => {
        observer.next(message);
      });
    });
  }

  endSession(sessionId: string): void {
    this.socket.emit('end_session', sessionId);
  }

  onNewResponse() {
    return new Observable((observer) => {
      this.socket.on('new_response', (response: ChatMessage) => {
        observer.next(response);
      });
    });
  }

  getMessagesForSession(sessionId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      API_URL2 + `/chatmessages/${sessionId}`
    );
  }

  deleteSession(sessionId: string): Observable<any> {
    return this.http.delete(API_URL2 + `/session/${sessionId}`);
  }

  // Método para obtener sesiones no leídas para un experto
  getActiveUnreadSessionsForExpert(
    expertId: string
  ): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(API_URL2 + `/unread`, {
      params: { expertId },
    });
  }
}
