import { Component, SimpleChanges } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { GirlUser, SubscriptionPayment, PaymentTier, Girl } from '../types';
import { formatSpanishDate, formatPrice } from '../helper-functions';
import { PaymentTierToNumberMap } from '../consts';
import { MainService } from '../main.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { InternalService } from '../internal.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [ToastModule, FormsModule, PasswordModule, CalendarModule, CommonModule, ButtonModule, ConfirmPopupModule, TooltipModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent {
  user: GirlUser | any;
  mostRecentPayment: SubscriptionPayment | undefined;

  showCreatePause: boolean = false;
  newPauseStartDate: Date | undefined;
  newPauseEndDate: Date | undefined;
  newPauseStartMinDate: Date = new Date();
  newPauseStartMaxDate: Date = new Date();
  newPauseEndMinDate: Date = new Date();
  newPauseEndMaxDate: Date = new Date();
  newPauseEndDateEnabled: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  confirmPasswordClass: string = '';

  deactivationDateTooltip: string =
    'Dado que los pagos pueden demorar en procesar, se agregan siempre 3 dias de margen a la subscripcion.\n\n si su subscripcion vence el 1 de Enero, se desactivara su cuenta recien el 4 de Enero por ejemplo';
  constructor(
    private mainService: MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private internalService: InternalService
  ) {
    this.internalService.girlUserData.subscribe((data) => {
      if (data) {
        this.user = data;
      }
    });
  }

  async getMostRecentPayment(subscriptionId: number) {
    const response = await this.mainService.getMostRecentPaymentBySubcriptionId(subscriptionId);
    this.mostRecentPayment = response.data;
  }

  passwordsMatch() {
    return this.newPassword !== this.confirmNewPassword && this.newPassword.length > 0 && this.confirmNewPassword.length > 0;
  }

  async changePassword() {
    const response = await this.authService.changePassword(this.user.id, this.oldPassword, this.newPassword);
    if (response.status === 200) {
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.messageService.add({
        severity: 'success',
        summary: 'Confirmado',
        detail: `Su contraseña fue cambiada con exito`,
        life: 3000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Ha ocurrido un error cambiando su contraseña, porfavor revise que la confirmacion de contraseña sea igual a la nueva contraseña, o intente nuevamente mas tarde`,
        life: 3000,
      });
    }
  }

  formatDate(date: string | Date) {
    return formatSpanishDate(date);
  }

  getDisableStatusForCreatePauseButton() {
    return this.user.girl.subscription.availablePauses < 1;
  }

  formatPrice(price: number) {
    return formatPrice(price);
  }

  createNewPause() {
    this.showCreatePause = true;
    const expiryDate = new Date(this.user.girl.subscription.expiryDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.newPauseStartMinDate = tomorrow;
    this.newPauseStartMaxDate = expiryDate;
    this.newPauseStartDate = tomorrow;
  }

  confirmUnhideGirl(event: Event, girl: Girl) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Estas segura de que quieres volver a hacer tu perfil visible?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const chagneHidenStatusResponse = await this.mainService.updateGirlHidenStatus(girl.id, false);
          if (chagneHidenStatusResponse.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmado',
              detail: `La visibilidad de su perfil se ha activado exitosamente.`,
              life: 3000,
            });
            this.user.girl.hiden = false;
            this.internalService.updateGirlUser(this.user);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Hubo un error al actualizar la visibilidad de su perfil.`,
              life: 3000,
            });
          }
        } catch (err) {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: `Hubo un error al actualizar la visibilidad de su perfil.`,
            life: 3000,
          });
        }
      },
      reject: () => {},
    });
  }
  confirmHideGirl(event: Event, girl: Girl) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Estas segura de que quieres esconder tu perfil?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: async () => {
        try {
          const chagneHidenStatusResponse = await this.mainService.updateGirlHidenStatus(girl.id, true);
          if (chagneHidenStatusResponse.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmado',
              detail: `Tu perfil se ha ocultado exitosamente.`,
              life: 3000,
            });
            this.user.girl.hiden = true;
            this.internalService.updateGirlUser(this.user);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Hubo un error al actualizar la visibilidad de su perfil.`,
              life: 3000,
            });
          }
        } catch (err) {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: `Hubo un error al actualizar la visibilidad de su perfil.`,
            life: 3000,
          });
        }
      },
      reject: () => {},
    });
  }

  startDateChange(startDate: any) {
    this.newPauseEndDateEnabled = true;
    const payTier: PaymentTier = this.user.girl.paymentTier;
    const maxNumberOfDays = PaymentTierToNumberMap[payTier];
    const maxDate = new Date(startDate);
    const minDate = new Date(startDate);
    minDate.setDate(startDate.getDate() + 1);
    maxDate.setDate(startDate.getDate() + maxNumberOfDays);
    this.newPauseEndDate = minDate;
    this.newPauseEndMinDate = minDate;
    this.newPauseEndMaxDate = maxDate;
  }

  deletePause(event: Event, pauseNumber: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás segura de que quieres borrar esta congelación de suscripción?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const deletePauseResponse = await this.mainService.cancelRegisteredPause(pauseNumber, this.user.girl.subscription.id, this.user.girl.id);
        if (deletePauseResponse.status === 200) {
          this.user.girl.subscription = deletePauseResponse.data.subscription;
          if (deletePauseResponse.data.girlActivated) {
            this.user.girl.active = true;
          }
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Congelación Cancelada`, life: 3000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error cancelando la Congelación', life: 3000 });
        }
      },
      reject: () => {},
    });
  }

  getShowCreatePauseButtonDisplay() {
    const pauseStart = this.user.girl.subscription.pauseStartDate;
    if (pauseStart) {
      return false;
    }
    return true;
  }

  confirmSavePause(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Estas segura de que quieres pausar tu subscripcion en las fechas indicadas?`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (this.newPauseStartDate !== undefined && this.newPauseEndDate !== undefined) {
          const registerPauseResponse = await this.mainService.registerPause(this.newPauseStartDate, this.newPauseEndDate, this.user.girl.subscription.id);
          if (registerPauseResponse.status === 200) {
            const udpatedSubscription = registerPauseResponse.data;
            this.user.girl.subscription = udpatedSubscription;
            this.cancelPause();
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Congelación registrada`, life: 3000 });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error registrando la Congelación', life: 3000 });
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un problema con las fechas ingresadas, por favor intente nuevamente',
            life: 3000,
          });
        }
      },
      reject: () => {},
    });
  }

  cancelPause() {
    this.showCreatePause = false;
    this.newPauseStartDate = undefined;
    this.newPauseEndDate = undefined;
    this.newPauseStartMinDate = new Date();
    this.newPauseStartMaxDate = new Date();
    this.newPauseEndMinDate = new Date();
    this.newPauseEndMaxDate = new Date();
    this.newPauseEndDateEnabled = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      if (this.user !== undefined) {
        this.getMostRecentPayment(this.user.girl.subscription.id);
      }
    }
  }
}
