import { Component, OnInit, Input } from "@angular/core";
import { SearchServiceComponent } from "../services/search.service";
import { SocketService, ChatMessage } from "../services/socket.service";
import { StorageServiceComponent } from "../services/storage.service";
import { take } from "rxjs/operators";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-taller-list",
  templateUrl: "./taller-list.component.html",
  styleUrls: ["./taller-list.component.css"],
})
export class TallerListComponent implements OnInit {
  userName = "";
  talleres: any[] = [];
  activeChats: any[] = [];
  showChat: boolean = false;
  selectedTaller: any | null = null;
  currentSessionId?: string;

  isOnline: boolean = false;

  checkTallerStatus() {
    this.isOnline = true;
  }

  constructor(
    private searchService: SearchServiceComponent,
    private socketService: SocketService,
    private storageService: StorageServiceComponent,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if (currentUser2 == "ROLE_MODERATOR" || currentUser2 == null) {
      setTimeout(() => {
        this.router.navigate(["/inicio"]);
      });
    }

    this.searchService.getAll().subscribe(
      (talleres) => {
        this.talleres = talleres;
      },
      (error) => {
        console.error("Error al obtener la lista de talleres", error);
      }
    );

    const user = this.storageService.getUser();
    this.userName = user.email;

    this.socketService.newMessage$.subscribe((message: ChatMessage) => {
      if (
        message.tallerId &&
        (this.currentSessionId === undefined ||
          this.currentSessionId !== message.sessionId)
      ) {
        this.showNotification(message);
      }
    });
  }
  showNotification(message: ChatMessage) {
    this.messageService.add({
      severity: "info",
      summary: `Nuevo mensaje de ${message.tallerName}`,
      detail: message.content,
    });
  }

  iniciarChatConTaller(taller: any) {
    if (this.selectedTaller) {
      this.socketService.leaveTallerRoom(this.selectedTaller._id);
    }

    const storedUser = this.storageService.getUser();
    if (!storedUser || !storedUser.id) {
      console.error("Usuario no definido en el almacenamiento.");
      return;
    }

    this.socketService.joinTallerRoom(
      taller._id,
      storedUser.id,
      storedUser.firstName,
      taller.WorkshopName
    );

    // Llama a sendMessageToTaller después de unirte al taller
    this.socketService
      .getSessionIdForList()
      .pipe(take(1))
      .subscribe((sessionData) => {
        this.currentSessionId = sessionData._id;
        localStorage.setItem("currentSessionId", sessionData._id);
        if (sessionData.isNewSession) {
          this.sendMessageToTaller(taller);
        } else {
          this.showChat = true;
          this.selectedTaller = taller;
        }
      });
  }

  updateChatVisibility(show: boolean) {
    this.showChat = show;
  }

  sendMessageToTaller(taller: any) {
    if (!this.currentSessionId) {
      return;
    }

    const storedUser = this.storageService.getUser();

    const message: ChatMessage = {
      tallerId: taller._id,
      sender: taller._id,
      content: "Hola, estamos aqui para servirte!",
      timestamp: new Date(),
      userId: storedUser.id,
      userName: this.userName,
      sessionId: this.currentSessionId,
      tallerName: taller.WorkshopName,
    };

    //console.log('Mensaje enviado desde el taller:', message);

    if (this.socketService.isConnected()) {
      this.socketService.sendMessage(message);
    } else {
      console.error("El socket aún no está conectado.");
    }

    // Actualiza selectedTaller al taller seleccionado
    this.selectedTaller = taller;

    // Muestra el componente de chat en la misma página
    this.showChat = true;
  }
  cerrarChat(taller: any) {
    this.socketService.leaveTallerRoom(taller._id);
  }

  logout(): void {
    this.router.navigate(["/inicio"]);
  }
}
