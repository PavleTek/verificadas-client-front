import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ClientReview, City, GirlUser } from './types';
import { firstValueFrom } from 'rxjs';
import { InternalService } from './internal.service';

interface Response {
  status: number;
  data: any;
}
@Injectable({
  providedIn: 'root',
})
export class MainService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private internalService: InternalService) {}

  async updateGirlObjectForClient(girl: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/girl-api/girl`, girl).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating Profile', error);
      throw error;
    }
  }

  // City Logic
  async getAllCities(): Promise<any> {
    try {
      const response = await this.http.get<Response>(`${this.baseUrl}/girl-api/cities`).toPromise();
      let cities: City[] = [];
      if (response) {
        cities = response.data;
      }
      return cities;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Specific Location Logic
  async getAllSpecificLocations(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/specificLocation`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Ethnicity Logic
  async getAllEthnicities(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/ethnicity`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Nationality Logic
  async getAllNationalities(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/nationality`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Service Logic
  async getAllServices(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/services`).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Girls Functions
  async getWholeGirlUserById(userId: number): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.get<Response>(`${this.baseUrl}/girl-api/girlUser/${userId}`));
      if (response.status === 200) {
        const girlUser: GirlUser = response.data;
        this.internalService.updateGirlUserForInitialLoad(girlUser);
      }
      return response;
    } catch (error) {
      console.error('Error Getting user:', error);
      throw error;
    }
  }

  // Safety Logic
  async createReview(review: ClientReview): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/girl-api/clientReview/`, review).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async getAllReviewsByGirl(girlId: number): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/clientReviewByGirl/${girlId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async getAllClientsByPhonePrefix(phonePrefix: number | string): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/clientByPhone/${phonePrefix}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async getAllClientReviewsByPhoneNumber(phoneNumber: number | string): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/clientReviewByPhone/${phoneNumber}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async deleteReviewByIdForGirl(reviewId: number): Promise<any> {
    try {
      const response = await this.http.delete(`${this.baseUrl}/girl-api/clientReview/${reviewId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async updateReview(review: ClientReview): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}/girl-api/clientReview/`, review).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Subscription Logic
  async getMostRecentPaymentBySubcriptionId(subscriptionId: number): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/subscription-api/lastPayment/${subscriptionId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying to the most recent payment', error);
      return error;
    }
  }

  async registerPause(pauseStartDate: Date, pauseEndDate: Date, subscriptionId: number): Promise<any> {
    const payload = { pauseStartDate, pauseEndDate, subscriptionId };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/pause/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying register a pause in the subscription', error);
      return error;
    }
  }

  async cancelRegisteredPause(pauseNumber: number, subscriptionId: number, girlId: number): Promise<any> {
    const payload = { pauseNumber, subscriptionId, girlId };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/cancelPause/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying register a pause in the subscription', error);
      return error;
    }
  }

  async updateGirlHidenStatus(girlId: number, desiredHidenStatus: boolean): Promise<any> {
    const payload = { girlId, desiredHidenStatus };
    try {
      const response = await this.http.put(`${this.baseUrl}/subscription-api/girlHidenStatus/`, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error trying to change girl hiden status', error);
      return error;
    }
  }

  //  Multimedia Logic
  async uploadImagesRequest(images: any[], girlId: number): Promise<any> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image, image.name); // Make sure to include the file name
      });
      const response = await this.http.post(`${this.baseUrl}/multimedia-api/request/${girlId}`, formData).toPromise();
      return response;
    } catch (error) {
      console.error('Error while uploading images', error);
      return error;
    }
  }

  // has to be an array because of some functions from libraries on the back end side, won't even try to solve this
  async uploadProfilePictureRequest(images: any[], girlId: number): Promise<any> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image, image.name); // Make sure to include the file name
      });
      const response = await this.http.post(`${this.baseUrl}/multimedia-api/profilePictureRequest/${girlId}`, formData).toPromise();
      return response;
    } catch (error) {
      console.error('Error while uploading profilePicture', error);
      return error;
    }
  }

  async getBanner(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/girl-api/banner`).toPromise();
      return response;
    } catch (error) {
      console.error(`Error while fetching pricing plan data`, error);
      return error;
    }
  }

  async setMainImage(mainIndex: number, girlid: number): Promise<any> {
    try {
      const payload = { mainImageIndex: mainIndex, girlId: girlid };
      const response = await this.http.put(`${this.baseUrl}/multimedia-api/setMainImage`, payload).toPromise();
      return response;
    } catch (error) {
      console.error(`Error while updating main image`, error);
      return error;
    }
  }
}
