import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ViewComponent } from './view/view.component';
import { MultimediaComponent } from './multimedia/multimedia.component';
import { EditComponent } from './edit/edit.component';
import { SafetyComponent } from './safety/safety.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', component: ViewComponent },
      { path: 'multimedia', component: MultimediaComponent },
      { path: 'safety', component: SafetyComponent },
      // { path: 'data', component: EditComponent },
      { path: 'edit', component: EditComponent },
      { path: 'subscription', component: SubscriptionComponent },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
