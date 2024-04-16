import { cloneDeep } from 'lodash';
import { MultimediaObject, TimeBracket, Girl } from './types';
import { environment } from '../environments/environment';

export function getTextFromTimeBracket(timeBracket: TimeBracket | undefined) {
  if (timeBracket !== undefined) {
    if (timeBracket.startTime === '00:00' && timeBracket.endTime === '24:00') {
      return '24h';
    } else {
      return `De: ${timeBracket.startTime}\nHasta: ${timeBracket.endTime}`;
    }
  } else {
    return undefined;
  }
}

export function formatPrice(price: Number) {
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return '$ ' + formattedPrice;
}

export function formatPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, '');
}

export function formatSpanishDate(dateOrString: Date | string): string {
  let date: Date;
  if (typeof dateOrString === 'string') {
    date = new Date(dateOrString);
  } else {
    date = dateOrString;
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleString('es-ES', options);
}

export function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&';
  let newGeneratedPassword = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    newGeneratedPassword += charset.charAt(Math.floor(Math.random() * n));
  }
  return newGeneratedPassword;
}

export function getAgeFromBday(bday: Date) {
  var today = new Date();
  var age = today.getFullYear() - bday.getFullYear();
  var monthDiff = today.getMonth() - bday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bday.getDate())) {
    age--;
  }

  return age;
}

export function getImageUrlFromImageName(imageName: string): string {
  const baseUrl: string = environment.baseImageUrl;
  const imageUrl: string = baseUrl + '/' + imageName;
  return imageUrl;
}

export function formatAllMultimediaUrlsFromGirl(girl: Girl): Girl {
  let formatedMultimediaGirl = cloneDeep(girl);
  const formattedImages = formatGirlImagesToUrls(girl.images);
  let activeProfilePicture = '';
  let requestProfilePicture;
  if (girl.profilePicture !== '') {
    activeProfilePicture = getImageUrlFromImageName(girl.profilePicture);
  }
  if (girl.requestProfilePicture !== undefined && girl.requestProfilePicture !== null && girl.requestProfilePicture !== '') {
    requestProfilePicture = getPendingImageUrlFromImageName(girl.requestProfilePicture);
  }
  formatedMultimediaGirl.images = formattedImages;
  formatedMultimediaGirl.requestProfilePicture = requestProfilePicture;
  formatedMultimediaGirl.profilePicture = activeProfilePicture;
  return formatedMultimediaGirl;
}

export function formatGirlImagesToUrls(images: MultimediaObject): MultimediaObject {
  const requestImages = Array.isArray(images.request) ? images.request.map((image) => getPendingImageUrlFromImageName(image)) : [];
  const activeImages = Array.isArray(images.active) ? images.active.map((image) => getImageUrlFromImageName(image)) : [];
  const bluredFaceImages = Array.isArray(images.bluredFace) ? images.bluredFace.map((image) => getImageUrlFromImageName(image)) : [];
  return { request: requestImages, active: activeImages, bluredFace: bluredFaceImages };
}

export function getPendingImageUrlFromImageName(imageName: string): string {
  const baseUrl: string = environment.basePendingimageUrl;
  const imageUrl: string = baseUrl + '/' + imageName;
  return imageUrl;
}

export function cleanPhoneNumberForDisplay(phoneNumber: number | string) {
  const stringPhoneNumber = phoneNumber.toString();
  return '+' + stringPhoneNumber.substring(0, 2) + ' ' + stringPhoneNumber.substring(2);
}
