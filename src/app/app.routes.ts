import { Routes } from '@angular/router';
import { noAuthGuard } from './guards/no-auth.guard';
import { authGuard } from './guards/auth.guard';
import { MainPage } from './pages/main/main.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.page').then((m) => m.AuthPage),
    canActivate: [noAuthGuard],
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/auth/sign-up/sign-up.page').then((m) => m.SignUpPage),
    canActivate: [noAuthGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage
      ),
    canActivate: [noAuthGuard],
  },
  {
    path: 'main',
    component: MainPage, // Asegura que MainPage se use aquí
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/main/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/main/profile/profile.page').then(
            (m) => m.ProfilePage
          ),
      },
      {
        path: 'sensors',
        loadComponent: () =>
          import('./pages/main/sensors/sensors.page').then(
            (m) => m.SensorsPage
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.page').then(
        (m) => m.NotFoundPage
      ),
  },
];
