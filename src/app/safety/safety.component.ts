import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { RatingModule } from 'primeng/rating';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';

import { GirlUser, ClientReview } from '../types';
import { formatSpanishDate, formatPhoneNumber } from '../helper-functions';
import { MainService } from '../main.service';
import { InternalService } from '../internal.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-safety',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    InputTextModule,
    ConfirmPopupModule,
    TooltipModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    TableModule,
    DividerModule,
    InputMaskModule,
    RatingModule,
  ],
  templateUrl: './safety.component.html',
  styleUrl: './safety.component.scss',
})
export class SafetyComponent {
  user: GirlUser | any;

  mainSearchInput: string = '';
  personalSearchInput: string = '';
  mainClientList: any[] = [];
  personalReviewList: ClientReview[] = [];

  searchTooltip: string =
    'Para Buscar reviews de clientes, debes ingresar al menos un numero en la casilla de busqueda \n\n La busqueda devolvera hasta 15 clientes cuyos numeros contengan el valor ingresado';
  mainSearchTriggered: boolean = false;

  selectedClient: any = false;

  // Create a review logic
  createReview: boolean = false;
  newReview: ClientReview = {
    review: '',
    phoneNumber: '',
    rating: 5,
  };

  constructor(
    private mainService: MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private internalService: InternalService
  ) {
    this.internalService.girlUserData.subscribe((data) => {
      if (data) {
        this.user = data;
      }
    });
  }

  startCreateReview() {
    this.createReview = true;
  }

  cancelCreateReview() {
    this.createReview = false;
    this.newReview = {
      review: '',
      phoneNumber: '',
      rating: 5,
    };
  }

  confirmDeleteReview(event: Event, clientReview: ClientReview) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estas segura de que quieres borrar esta reseña?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (clientReview.id) {
          const deleteReviewResponse = await this.mainService.deleteReviewByIdForGirl(clientReview.id);
          if (deleteReviewResponse.status === 200) {
            await this.getAndSetAllReviewsByGirl();
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Reseña Borrada`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error Borrando reseña, intente mas tarde', life: 3000 });
          }
        }
      },
      reject: () => {},
    });
  }

  async goToClientPage(phoneNumber: string) {
    const clientReviews = await this.mainService.getAllClientReviewsByPhoneNumber(phoneNumber);
    this.selectedClient = {
      phoneNumber: phoneNumber,
      reviews: clientReviews,
    };
  }

  async backFromClientView() {
    this.selectedClient = false;
  }

  formatDate(dateString: string) {
    return formatSpanishDate(dateString);
  }

  async saveNewReview() {
    const newReview: ClientReview = {
      phoneNumber: formatPhoneNumber(this.newReview.phoneNumber),
      review: this.newReview.review,
      rating: this.newReview.rating,
      girlId: this.user.girlId,
    };
    if (this.newReview.phoneNumber.length <= 10) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `Hubo un error creando su reseña, porfavor ingrese el numero telefonico completo del cliente`,
        life: 3000,
      });
    } else {
      const response = await this.mainService.createReview(newReview);
      if (response.status === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: `Reseña creada con exito`,
          life: 3000,
        });
        this.cancelCreateReview();
        await this.getAndSetAllReviewsByGirl();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Hubo un error creando su reseña, porfavor intente mas tarde`, life: 3000 });
        this.createReview = false;
      }
    }
  }

  cleanPhone(phoneNumber: string) {
    return '+' + phoneNumber.substring(0, 2) + ' ' + phoneNumber.substring(2);
  }

  async searchForClientsWithPhonePrefix() {
    if (this.mainSearchInput) {
      this.mainSearchTriggered = true;
      const clientsWithPhoneNumberPrefix = await this.mainService.getAllClientsByPhonePrefix(this.mainSearchInput);
      this.mainClientList = clientsWithPhoneNumberPrefix;
    }
  }

  async getAndSetAllReviewsByGirl() {
    const personalReviews = await this.mainService.getAllReviewsByGirl(this.user.girlId);
    this.personalReviewList = personalReviews;
  }

  async ngOnInit() {
    this.getAndSetAllReviewsByGirl();
  }
}
