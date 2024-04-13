import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';

import {
  sessionDurationOptions,
  eyeColorOptions,
  hairColorOptions,
  contextureOptions,
  bottomSizeOptions,
  chestSizeOptions,
  shavingStatusOptions,
  languageOptions,
  timeOptions,
} from '../consts';
import { City, Girl, Service, TimeBracket, ScheduleRow, AllDaysTimeOptions, GirlCategory, SpecificLocation, Nationality, Ethnicity } from '../types';
import { getTextFromTimeBracket, getAgeFromBday, cleanPhoneNumberForDisplay } from '../helper-functions';
import { InternalService } from '../internal.service';
import { MainService } from '../main.service';
import { MessageService } from 'primeng/api';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    InputTextareaModule,
    InputTextareaModule,
    InputMaskModule,
    InputSwitchModule,
    StyleClassModule,
    DropdownModule,
    ToastModule,
    InputNumberModule,
    ListboxModule,
    TableModule,
    TagModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  originalGirl: Girl | any;
  girl: Girl | any;

  constructor(private mainService: MainService, private messageService: MessageService, private internalService: InternalService) {
    this.internalService.girlData.subscribe((data) => {
      if (data) {
        this.originalGirl = data;
        this.girl = data;
      }
    });
  }

  sessionDurationOptions: string[] = sessionDurationOptions;
  eyeColorOptions: string[] = eyeColorOptions;
  hairColorOptions: string[] = hairColorOptions;
  contextureOptions: string[] = contextureOptions;
  bottomSizeOptions: string[] = bottomSizeOptions;
  chestSizeOptions: string[] = chestSizeOptions;
  shavingStatusOpptions: string[] = shavingStatusOptions;
  languageOptions: string[] = languageOptions;

  timeOptionsForMonday: string[] = [...timeOptions];
  timeOptionsForTuesday: string[] = [...timeOptions];
  timeOptionsForWednesday: string[] = [...timeOptions];
  timeOptionsForThursday: string[] = [...timeOptions];
  timeOptionsForFriday: string[] = [...timeOptions];
  timeOptionsForSaturday: string[] = [...timeOptions];
  timeOptionsForSunday: string[] = [...timeOptions];
  allDaysTimeOptions: AllDaysTimeOptions = {
    monday: this.timeOptionsForMonday,
    tuesday: this.timeOptionsForTuesday,
    wednesday: this.timeOptionsForWednesday,
    thursday: this.timeOptionsForThursday,
    friday: this.timeOptionsForFriday,
    saturday: this.timeOptionsForSaturday,
    sunday: this.timeOptionsForSunday,
  };
  masajista: boolean = false;

  allServices: Service[] = [];
  allCities: City[] = [];
  allSpecificLocations: SpecificLocation[] = [];
  allNationalities: Nationality[] = [];
  allEthnicities: Ethnicity[] = [];

  async populateAllInitialData() {
    try {
      const [allServicesResponse, allCitiesFromResponse, allSpecificLocationsResponse, allNationalitiesResponse, allEthnicitiesResponse] = await Promise.all([
        this.mainService.getAllServices(),
        this.mainService.getAllCities(),
        this.mainService.getAllSpecificLocations(),
        this.mainService.getAllNationalities(),
        this.mainService.getAllEthnicities(),
      ]);
      this.allServices = allServicesResponse.data;
      this.allCities = allCitiesFromResponse;
      this.allSpecificLocations = allSpecificLocationsResponse.data;
      this.allNationalities = allNationalitiesResponse.data;
      this.allEthnicities = allEthnicitiesResponse.data;
    } catch (error) {
      console.error('An error occurred while populating initial data:', error);
    }
  }

  cancelAllChanges() {
    this.girl = cloneDeep(this.originalGirl);
  }

  cleanPhoneNumber(phoneNumber: string | number) {
    return cleanPhoneNumberForDisplay(phoneNumber);
  }

  // Scheduler Logic
  addTimeBracketToDay(day: keyof ScheduleRow) {
    const dayA = this.girl.schedule[0][day];
    const dayB = this.girl.schedule[1][day];
    const dayC = this.girl.schedule[2][day];
    if (!dayA) {
      this.girl.schedule[0][day] = { startTime: '00:00', endTime: '24:00' };
    } else if (!dayB) {
      this.girl.schedule[1][day] = { startTime: '00:00', endTime: '24:00' };
    } else if (!dayC) {
      this.girl.schedule[2][day] = { startTime: '00:00', endTime: '24:00' };
    }
  }

  removeTimeBracket(day: keyof ScheduleRow, index: number) {
    this.girl.schedule[index][day] = undefined;
  }

  shouldAddTimeBracketButtonAppear(day: keyof ScheduleRow): boolean {
    let [dayA, dayB, dayC] = [this.girl.scheduleRows[0], this.girl.scheduleRows[1], this.girl.scheduleRows[2]];
    return !dayA || !dayB || !dayC;
  }

  getTextFromTimeBracket(timeBracket: TimeBracket | undefined) {
    return getTextFromTimeBracket(timeBracket);
  }

  sortScheduleRowsByDay(scheduleRows: ScheduleRow[], dayToSort: keyof ScheduleRow) {
    const dayA = scheduleRows[0][dayToSort];
    const dayB = scheduleRows[1][dayToSort];
    const dayC = scheduleRows[2][dayToSort];
    const allDay = { startTime: '00:00', endTime: '24:00' };
    if (
      (dayA && dayA.startTime === '00:00' && dayA.endTime === '24:00') ||
      (dayB && dayB.startTime === '00:00' && dayB.endTime === '24:00') ||
      (dayC && dayC.startTime === '00:00' && dayC.endTime === '24:00')
    ) {
      scheduleRows[0][dayToSort] = allDay;
      scheduleRows[1][dayToSort] = undefined;
      scheduleRows[2][dayToSort] = undefined;
    } else {
      const days = [dayA, dayB, dayC];
      days.sort((dayA, dayB) => {
        if (dayA && dayB) {
          return dayA.startTime.localeCompare(dayB.startTime);
        } else if (!dayA) {
          return 1;
        } else if (!dayB) {
          return -1;
        } else {
          return 0;
        }
      });
      scheduleRows[0][dayToSort] = days[0];
      scheduleRows[1][dayToSort] = days[1];
      scheduleRows[2][dayToSort] = days[2];
    }
  }

  sortScheduleRows(scheduleRows: ScheduleRow[]) {
    if (scheduleRows !== undefined) {
      this.sortScheduleRowsByDay(scheduleRows, 'monday');
      this.sortScheduleRowsByDay(scheduleRows, 'tuesday');
      this.sortScheduleRowsByDay(scheduleRows, 'wednesday');
      this.sortScheduleRowsByDay(scheduleRows, 'thursday');
      this.sortScheduleRowsByDay(scheduleRows, 'friday');
      this.sortScheduleRowsByDay(scheduleRows, 'saturday');
      this.sortScheduleRowsByDay(scheduleRows, 'sunday');
    }
  }

  capitalizeEachWord(inputString: string) {
    if (!inputString || inputString === undefined) {
      return '';
    }
    const words = inputString.split(' ');
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  }

  mapGirlToSqlAcceptedObject(girl: Girl) {
    girl.name = this.capitalizeEachWord(girl.name);
    const readyForBackEndObject: any = {
      ...girl,
    };
    delete readyForBackEndObject.cityId;
    delete readyForBackEndObject.images;
    delete readyForBackEndObject.videos;
    delete readyForBackEndObject.profilePicture;
    delete readyForBackEndObject.requestProfilePicture;
    return readyForBackEndObject;
  }

  setInitialCategoriesValues() {
    const initialCategories: GirlCategory[] = this.girl.categories;
    if (initialCategories.includes(GirlCategory.BARBIE)) {
      this.girl.barbie = true;
    }
    if (initialCategories.includes(GirlCategory.MASAJISTAS)) {
      this.masajista = true;
    }
  }

  setCategoriesForSave() {
    const bday = new Date(this.girl.bday);
    const age = getAgeFromBday(bday);
    const price = this.girl.sessionPrices.oneHourPrice;
    const finalCategories: GirlCategory[] = [];
    if (this.girl.barbie) {
      finalCategories.push(GirlCategory.BARBIE);
    }
    if (this.masajista) {
      finalCategories.push(GirlCategory.MASAJISTAS);
    }
    if (age > 35) {
      finalCategories.push(GirlCategory.MADURAS);
    }
    if (price >= 100000) {
      finalCategories.push(GirlCategory.GOLD);
    }
    if (price > 50000 && price < 100000) {
      finalCategories.push(GirlCategory.SILVER);
    }
    if (price <= 50000) {
      finalCategories.push(GirlCategory.BRONZE);
    }
    this.girl.categories = finalCategories;
  }

  async saveGirlChanges() {
    this.sortScheduleRows(this.girl.schedule);
    this.setCategoriesForSave();
    const readyForBackEndObject = this.mapGirlToSqlAcceptedObject(this.girl);
    const response = await this.mainService.updateGirlObjectForClient(readyForBackEndObject);
    if (response.status === 200) {
      this.messageService.add({
        severity: 'success',
        summary: 'Confirmed',
        detail: `Girl updated succesfully`,
        life: 3000,
      });
      this.internalService.updateGirl(this.girl);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `Error Updating Girl`,
        life: 3000,
      });
    }
  }

  setUndefinedValuesToNotSpecify() {
    if (this.girl.specificLocation === undefined || this.girl.specificLocation === null) {
      const location = this.allSpecificLocations.find((location) => location.name === 'No Especificar');
      this.girl.specificLocation = location;
    }
    if (this.girl.ethnicity === undefined || this.girl.ethnicity === null) {
      const ethnicity = this.allEthnicities.find((ethnicity) => ethnicity.name === 'No Especificar');
      this.girl.ethnicity = ethnicity;
    }
    if (this.girl.nationality === undefined || this.girl.nationality === null) {
      const nationality = this.allNationalities.find((nationality) => nationality.name === 'No Especificar');
      this.girl.nationality = nationality;
    }
  }

  async ngOnInit(): Promise<void> {
    this.sortScheduleRows(this.girl.schedule);
    await this.populateAllInitialData();
    this.setUndefinedValuesToNotSpecify();
  }
}
