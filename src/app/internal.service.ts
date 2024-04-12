import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GirlUser, Girl } from './types';
import { formatGirlImagesToUrls, getPendingImageUrlFromImageName, getImageUrlFromImageName } from './helper-functions';
import { cloneDeep } from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class InternalService {
  private girlUser = new BehaviorSubject<GirlUser | null>(null);
  private girl = new BehaviorSubject<Girl | null>(null);
  girlUserData = this.girlUser.asObservable();
  girlData = this.girl.asObservable();

  constructor() {}

  updateGirlUser(data: GirlUser) {
    this.updateGirl(data.girl);
  }

  updateGirlUserForInitialLoad(data: GirlUser) {
    const girl: Girl = cloneDeep(data.girl);
    // Formate profile picture, request profile picture, and all possible images
    let formatedRequestProfilePicture;
    let formatedProfilePicture = '';
    if (girl.requestProfilePicture !== undefined && girl.requestProfilePicture !== null && girl.requestProfilePicture !== '') {
      formatedRequestProfilePicture = getPendingImageUrlFromImageName(girl.requestProfilePicture);
    }
    if (girl.profilePicture !== undefined && girl.profilePicture !== '') {
      formatedProfilePicture = getImageUrlFromImageName(girl.profilePicture);
    }
    const formattedImages = formatGirlImagesToUrls(girl.images);
    // create copies for setting stuff
    const girlWithFormatedMultimedia: Girl = {
      ...girl,
      images: formattedImages,
      requestProfilePicture: formatedRequestProfilePicture,
      profilePicture: formatedProfilePicture,
    };
    const girlUserWithFormatedMultimedia: GirlUser = { ...data, girl: girlWithFormatedMultimedia };
    // update in internal service values
    this.girlUser.next(girlUserWithFormatedMultimedia);
    this.girl.next(girlWithFormatedMultimedia);
  }

  updateGirlUserAndFormatImages(data: GirlUser) {
    this.girlUser.next(data);
    this.updateGirlAndFormatImages(data.girl);
  }

  updateGirl(data: Girl) {
    this.girl.next(data);
  }

  updateGirlAndFormatImages(data: Girl) {
    let formatedRequestProfilePicture;
    let formatedProfilePicture = '';
    if (data.requestProfilePicture !== undefined && data.requestProfilePicture !== null && data.requestProfilePicture !== '') {
      formatedRequestProfilePicture = getPendingImageUrlFromImageName(data.requestProfilePicture);
    }
    if (data.profilePicture !== undefined && data.profilePicture !== '') {
      formatedProfilePicture = getImageUrlFromImageName(data.profilePicture);
    }
    const formattedImages = formatGirlImagesToUrls(data.images);
    const girl: Girl = { ...data, images: formattedImages, requestProfilePicture: formatedRequestProfilePicture, profilePicture: formatedProfilePicture };
    this.girl.next(girl);
  }

  updateGirlAndFormateNewImages(data: Girl) {
    const formattedImages = formatGirlImagesToUrls(data.images);
    const girl: Girl = { ...data, images: formattedImages };
    this.girl.next(girl);
  }
}
