import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ChatMessage, SocketService } from "../services/socket.service";
import { StorageServiceComponent } from "../services/storage.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat-list",
  templateUrl: "./chat-list.component.html",
  styleUrls: ["./chat-list.component.css"],
})
export class ChatListComponent implements OnInit {
  sessions: any[] = [];
  userId: string | undefined;
  selectedSession: string | undefined;

  @Output() onSessionChange: EventEmitter<{
    sessionId: string;
    userId: string;
    userName: string;
    expertId: string;
    expertName: string;
  }> = new EventEmitter();

  constructor(
    private socketService: SocketService,
    private storageService: StorageServiceComponent,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if (currentUser2 == null) {
      setTimeout(() => {
        this.router.navigate(["/inicio"]);
      });
    }

    const user = this.storageService.getUser();
    this.userId = user?.id;
    this.loadSessions();
    this.socketService.newMessage$.subscribe((message: ChatMessage) => {
      if (
        message.userId &&
        (this.selectedSession === undefined ||
          this.selectedSession !== message.sessionId)
      ) {
        this.showNotification(message);
      }
    });
  }

  loadSessions(): void {
    if (this.userId) {
      this.socketService
        .getActiveUnreadSessionsForExpert(this.userId)
        .subscribe(
          (response: any) => {
            if (
              response.activeUnreadSessions &&
              Array.isArray(response.activeUnreadSessions)
            ) {
              this.sessions = response.activeUnreadSessions;
            } else if (response.message) {
              this.sessions = [];
            } else {
              console.error("Unexpected response:", response);
            }
          },
          (error) => console.error("Error al cargar sesiones:", error)
        );
    }
  }

  showNotification(message: ChatMessage) {
    this.messageService.add({
      severity: "info",
      summary: `Nuevo mensaje de ${message.userName}`,
      detail: message.content,
    });
  }

  selectSession(
    sessionId?: string,
    userId?: string,
    userName?: string,
    expertId?: string,
    expertName?: string
  ): void {
    if (sessionId && userId && userName && expertId && expertName) {
      this.selectedSession = sessionId;
      const user = this.storageService.getUser();
      this.onSessionChange.emit({
        sessionId: sessionId,
        userId: userId,
        userName: userName,
        expertId: expertId,
        expertName: expertName,
      });
    } else {
      console.warn("Tentativa de selección de una sesión sin datos completos");
    }
  }
}
