import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { SocketService, ChatMessage } from "../services/socket.service";
import { StorageServiceComponent } from "../services/storage.service";
import { MessageService } from "primeng/api";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat-box",
  templateUrl: "./chat-box.component.html",
  styleUrls: ["./chat-box.component.css"],
})
export class ChatBoxComponent implements OnInit, OnChanges {
  @Input() sessionData:
    | { sessionId: string; userId: string; userName: string }
    | undefined;
  public messages: ChatMessage[] = [];
  public newMessage: string = "";
  public userId: string | undefined;
  public TallerId: string | undefined;
  public userName: string | undefined;
  public tallerName: string | undefined;
  public activeSessionId: string | undefined;

  isOnline: boolean = false;

  checkTallerStatus() {
    this.isOnline = true;
  }

  @ViewChild("messageContainer") private messageContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  constructor(
    private socketService: SocketService,
    private storageService: StorageServiceComponent,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if (currentUser2 == null) {
      setTimeout(() => {
        this.router.navigate(["/inicio"]);
      });
    }
    // Escucha los mensajes entrantes desde el servidor Socket.io
    this.socketService.getMessages().subscribe((message: ChatMessage) => {
      // Solo agregamos mensajes de la sesión activa
      if (message.sessionId === this.activeSessionId) {
        this.messages.push(message);
      }
      const storedUser = this.storageService.getUser();
      if (
        message.userId !== storedUser.id &&
        message.sender !== this.TallerId
      ) {
        // Muestra la notificación para el nuevo mensaje
        //this.socketService.emitNewMessageEvent(message);
      }
    });

    // Obtener el userId al inicializar el componente utilizando el servicio de almacenamiento
    const storedUser = this.storageService.getUser();
    if (storedUser && storedUser.id) {
      this.TallerId = storedUser.id;
    } else {
      console.warn(
        "El Taller no está definido en el servicio de almacenamiento."
      );
    }

    const user = this.storageService.getUser();
    this.TallerId = user?.id;
  }

  getFormattedMessageDate(date: Date): string {
    return this.datePipe.transform(date, "HH:mm")!;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["sessionData"] && changes["sessionData"].currentValue) {
      const { sessionId, userId, userName, expertId, expertName } =
        changes["sessionData"].currentValue;
      this.activeSessionId = sessionId;
      this.userId = userId;
      this.userName = userName;
      this.TallerId = expertId;
      this.tallerName = expertName;
      this.onActiveSessionChange(sessionId);

      // Conéctate a la nueva sesión.
      this.socketService.joinTallerRoom(
        this.TallerId!,
        this.userId!,
        this.userName!,
        this.tallerName!
      );
    }
  }

  // Este método se llama cuando se selecciona una nueva sesión en ChatListComponent
  onActiveSessionChange(sessionId: string) {
    if (this.activeSessionId) {
      this.socketService.leaveSession(this.activeSessionId);
    }

    // Si lo deseas, puedes limpiar los mensajes anteriores aquí al cambiar de sesión.
    this.messages = [];

    this.socketService.getMessagesForSession(sessionId).subscribe(
      (messages) => {
        this.messages = messages;
      },
      (error) => {
        console.error("Error fetching messages for session:", error);
      }
    );
  }
  showNotification(message: ChatMessage) {
    this.messageService.add({
      severity: "info",
      summary: `Nuevo mensaje de ${message.userName}`,
      detail: message.content,
    });
  }

  // Envía un nuevo mensaje al servidor a través de Socket.io
  sendMessage() {
    if (
      this.newMessage.trim() === "" ||
      !this.TallerId ||
      !this.activeSessionId
    )
      return;

    // Crea un mensaje con identificación de sesión y remitente
    const messageToSend: ChatMessage = {
      sessionId: this.activeSessionId,
      content: this.newMessage,
      timestamp: new Date(),
      sender: this.TallerId,
      userId: this.userId,
      userName: this.userName,
      tallerId: this.TallerId,
      tallerName: this.tallerName,
    };

    // Envía el mensaje al servidor
    this.socketService.sendMessage(messageToSend);

    // Limpia el campo de entrada de mensaje
    this.newMessage = "";
  }
}
