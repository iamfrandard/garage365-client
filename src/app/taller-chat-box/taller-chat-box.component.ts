import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { SocketService, ChatMessage } from "../services/socket.service";
import { UserService, ChatSession } from "../services/user.service";
import { StorageServiceComponent } from "../services/storage.service";
import { AuthService } from "../services/auth.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-taller-chat-box",
  templateUrl: "./taller-chat-box.component.html",
  styleUrls: ["./taller-chat-box.component.css"],
})
export class TallerChatBoxComponent implements OnInit {
  @Input() taller: any;
  storedUser: any;
  userName = "";
  @Output() chatVisibilityChanged = new EventEmitter<boolean>();
  @Output() chatClosed = new EventEmitter<void>();
  public messages: ChatMessage[] = [];
  public newMessage: string = "";
  public id: string | undefined;
  public sessions: ChatSession[] = [];
  public selectedSession: string | undefined;

  @ViewChild("messageContainer") private messageContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["taller"] &&
      changes["taller"].currentValue !== changes["taller"].previousValue
    ) {
      this.resetChat();
      this.cdRef.detectChanges();
    }
  }

  resetChat(): void {
    this.messages = [];
    this.newMessage = "";
  }

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
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if (currentUser2 == null) {
      setTimeout(() => {
        this.router.navigate(["/inicio"]);
      });
    }

    this.socketService.getMessages().subscribe((message: ChatMessage) => {
      const storedUser = this.storageService.getUser();
      if (message.tallerId !== this.id && message.sender !== this.id) {
        this.showNotification(message);
      }
      this.messages.push(message);
    });

    const user = this.storageService.getUser();
    this.userName = user.email;

    // Escuchar y obtener la información del sessionId cuando el usuario se une a un taller

    this.socketService.getSessionId().subscribe((sessionId: string) => {
      this.selectedSession = sessionId;
      // console.log('Sesión de chat establecida:', this.selectedSession);
      if (this.selectedSession) {
        this.loadMessagesForSession();
      }

      // Aquí puedes cargar los mensajes anteriores de la sesión si es necesario.
      this.loadMessagesForSession();
    });

    // Obtener el userId al inicializar el componente utilizando el servicio de almacenamiento
    const storedUser = this.storageService.getUser();
    if (storedUser && storedUser.id) {
      this.storedUser = storedUser;
      this.id = storedUser.id;
      this.loadSessions();
    } else {
      console.warn(
        "El userId no está definido en el servicio de almacenamiento."
      );
    }
  }

  showNotification(message: ChatMessage) {
    const isInitialTallerMessage =
      message.content === "Hola, estamos aqui para servirte!";
    const isSentByTaller = message.sender === message.tallerId;

    if (isInitialTallerMessage && isSentByTaller) {
      return;
    }
    // this.messageService.add({
    //   severity: "info",
    //   summary: `Nuevo mensaje de ${message.tallerName}`,
    //   detail: message.content,
    // });
  }

  // Carga todas las sesiones de chat para el taller
  loadSessions() {
    if (!this.id) {
      console.warn("El userId no está definido.");
      return;
    }
  }

  // Carga los mensajes de la sesión seleccionada
  loadMessagesForSession() {
    if (!this.selectedSession) return;
    this.userService.getMessagesForSession(this.selectedSession).subscribe(
      (messages: ChatMessage[]) => {
        this.messages = messages;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sendMessage() {
    if (this.newMessage.trim() === "" || !this.id) {
      // console.log(
      //   'Intentando enviar mensaje...',
      //   this.newMessage,
      //   this.id,
      //   this.selectedSession
      // );
      return;
    }

    if (!this.id) {
      console.warn("userId o selectedSession no están definidos.");
      return;
    }

    const messageToSend: ChatMessage = {
      sessionId: this.selectedSession,
      userId: this.id,
      userName: this.userName,
      sender: this.id,
      content: this.newMessage,
      timestamp: new Date(),
      tallerId: this.taller._id,
      tallerName: this.taller.WorkshopName,
    };
    //console.log('Enviando mensaje:', messageToSend);

    this.socketService.sendMessage(messageToSend);
    this.newMessage = "";
  }

  isSender(message: ChatMessage): boolean {
    if (message.sender === message.tallerId) {
      return false;
    }
    return this.id === message.userId;
  }

  cerrarChat() {
    this.chatVisibilityChanged.emit(false);
    localStorage.removeItem("currentSessionId");
    this.socketService.leaveTallerRoom(this.selectedSession as string);
    this.socketService.endSession(this.selectedSession as string);

    if (this.selectedSession) {
      this.socketService.deleteSession(this.selectedSession).subscribe(
        (response) => {
          console.log("Sesión eliminada correctamente", response);
        },
        (error) => {
          console.error("Error al eliminar la sesión:", error);
        }
      );
    }
  }
}
