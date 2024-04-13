import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { FileUploadHandlerEvent } from 'primeng/fileupload';

import { paymentTierToMaxImagesMap } from '../consts';
import { Girl } from '../types';
import { getPendingImageUrlFromImageName } from '../helper-functions';
import { MessageService } from 'primeng/api';
import { MainService } from '../main.service';
import { InternalService } from '../internal.service';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, GalleriaModule, ToastModule, FileUploadModule],
  providers: [MessageService],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.scss',
})
export class MultimediaComponent {
  girl: Girl | any;
  @ViewChild('specificComponent') specificComponent: ElementRef | any;

  uploadedFiles: any[] = [];
  paymentTierToMaxImagesMap: any = paymentTierToMaxImagesMap;
  totalImages: number = 1;
  activeGaleriaImages: string[] = [];
  displayCustom: boolean = false;
  activeIndex: number = 0;
  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(
    private messageService: MessageService,
    private mainService: MainService,
    private elementRef: ElementRef,
    private internalService: InternalService
  ) {
    this.internalService.girlData.subscribe((data) => {
      if (data) {
        this.girl = data;
      }
    });
  }

  async onUploadPicture(event: FileUploadHandlerEvent) {
    try {
      const uploadImagesResponse = await this.mainService.uploadImagesRequest(event.files, this.girl.id);
      if (uploadImagesResponse.status === 200) {
        this.girl.images = uploadImagesResponse.data;
        this.internalService.updateGirlAndFormateNewImages(this.girl);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Imagenes subidas con exito`, life: 3000 });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Operacion rechazada', detail: 'Error subiendo imagenes', life: 3000 });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Operacion rechazada', detail: `Error subiendo imagenes ${error}`, life: 3000 });
    }
  }

  async onUploadProfilePicture(event: FileUploadHandlerEvent) {
    try {
      const uploadProfilePictureResponse = await this.mainService.uploadProfilePictureRequest(event.files, this.girl.id);
      if (uploadProfilePictureResponse.status === 200) {
        this.girl.requestProfilePicture = getPendingImageUrlFromImageName(uploadProfilePictureResponse.data);
        this.internalService.updateGirl(this.girl);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Foto de perfil subida con exito`, life: 3000 });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Operacion rechazada', detail: 'Error subiendo foto de perfil', life: 3000 });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Operacion rechazada', detail: `Error subiendo foto de perfil ${error}`, life: 3000 });
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.isClickedInsideAllowedElements(event.target)) {
      this.displayCustom = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydown(event: KeyboardEvent) {
    this.displayCustom = false;
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onLeftArrowKeydown(event: KeyboardEvent) {
    this.activeIndex = (this.activeIndex - 1 + this.totalImages) % this.totalImages;
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onRightArrowKeydown(event: KeyboardEvent) {
    this.activeIndex = (this.activeIndex + 1) % this.totalImages;
  }

  isClickedInsideAllowedElements(target: any): boolean {
    if (target.closest('#customImageDisplay') !== null) {
      return true;
    }
    if (this.isButtonOrAncestor(target)) {
      return true;
    }
    const gridElementPending = this.elementRef.nativeElement.querySelector('#imageGridPending');
    const gridElementActive = this.elementRef.nativeElement.querySelector('#imageGridActive');
    const gridEleementPPR = this.elementRef.nativeElement.querySelector('#profilePictureRequestContainer');
    const gridEleementPPA = this.elementRef.nativeElement.querySelector('#activeProfilePictureContainer');
    if (
      (gridElementPending && gridElementPending.contains(target)) ||
      (gridElementActive && gridElementActive.contains(target)) ||
      (gridEleementPPR && gridEleementPPR.contains(target)) ||
      (gridEleementPPA && gridEleementPPA.contains(target))
    ) {
      return true;
    }
    return false;
  }

  isButtonOrAncestor(element: any): boolean {
    // Traverse up the DOM tree from the clicked element
    while (element) {
      if (element.tagName && element.tagName.toLowerCase() === 'button') {
        return true; // If a button element is found, return true
      }
      element = element.parentNode; // Move to the parent node
    }
    return false; // If no button element is found, return false
  }

  openImage(index: number, imagesType: string) {
    if (imagesType === 'request') {
      this.activeGaleriaImages = this.girl.images.request;
      this.totalImages = this.girl.images.request.length;
    } else if (imagesType === 'active') {
      this.activeGaleriaImages = this.girl.images.active;
      this.totalImages = this.girl.images.active.length;
    } else if (imagesType === 'profilePictureRequest') {
      this.activeGaleriaImages = [this.girl.requestProfilePicture];
      this.totalImages = 1;
    } else if (imagesType === 'activeProfilePicture') {
      this.activeGaleriaImages = [this.girl.profilePicture];
      this.totalImages = 1;
    }
    this.activeIndex = index;
    this.displayCustom = true;
    console.log(this.girl);
  }
}
