import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';
import { HttpClientModule } from '@angular/common/http';
import { MainService } from '../main.service';
import { AuthService } from '../auth.service';
import { InternalService } from '../internal.service';
import { GirlUser } from '../types';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule, StyleClassModule, InputTextModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  currentView: string = '';
  views: any = { home: true, multimedia: false, safety: false, data: false, edit: false, subscription: false, login: true };
  user: GirlUser | any;
  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private router: Router,
    private internalService: InternalService,
    private location: Location
  ) {
    this.internalService.girlUserData.subscribe((data) => {
      if (data) {
        this.user = data;
      }
    });
  }

  logOutUser() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHomeView() {
    this.views = { home: true, multimedia: false, safety: false, data: false, edit: false, subscription: false, login: false };
    this.router.navigate(['/home/view']);
  }

  goToMultimediaView() {
    this.views = { home: false, multimedia: true, safety: false, data: false, edit: false, subscription: false, login: false };
    this.router.navigate(['home/multimedia']);
  }

  goToEditView() {
    this.views = { home: false, multimedia: false, safety: false, data: false, edit: true, subscription: false, login: false };
    this.router.navigate(['/home/edit']);
  }

  goToSafetyView() {
    this.views = { home: false, multimedia: false, safety: true, data: false, edit: false, subscription: false, login: false };
    this.router.navigate(['/home/safety']);
  }

  goToDataView() {
    this.views = { home: false, multimedia: false, safety: false, data: true, edit: false, subscription: false, login: false };
    this.router.navigate(['/home/data']);
  }

  goToSubscriptionView() {
    this.views = { home: false, multimedia: false, safety: false, data: false, edit: false, subscription: true, login: false };
    this.router.navigate(['/home/subscription']);
  }

  goToLoginView() {
    this.views = { home: false, multimedia: false, safety: false, data: false, edit: false, subscription: false, login: true };
    this.router.navigate(['/login']);
  }

  async getGirlAndProfile() {
    const profile = await this.authService.getUserProfile();
    const userId = profile.id;
    await this.mainService.getWholeGirlUserById(userId);
  }

  async ngOnInit() {
    const isGirlLoggedIn = await this.authService.isGirlLoggedIn();
    if (!isGirlLoggedIn) {
      this.goToLoginView();
    } else {
      await this.getGirlAndProfile();
      const completePath = this.location.path();
      const view = completePath.split('/')[2];
      if (view === 'home/view') {
        this.goToHomeView();
      } else if (view === 'home/multimedia') {
        this.goToMultimediaView();
      } else if (view === 'home/edit') {
        this.goToEditView();
      } else if (view === 'home/safety') {
        this.goToSafetyView();
      } else if (view === 'home/data') {
        this.goToDataView();
      } else if (view === 'home/subscription') {
        this.goToSubscriptionView();
      } else if (view === 'home/login') {
        this.goToLoginView();
      }
      this.currentView = view;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const completePath = this.location.path();
          const view = completePath.split('/')[2];
          this.currentView = view;
        }
      });
    }
  }
}
