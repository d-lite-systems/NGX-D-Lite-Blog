import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { AboutComponent } from './pages/about/about.component';
import { MediasComponent } from './pages/medias/medias.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/users/register/register.component';
import { LoginComponent } from './pages/users/login/login.component';
import { LogoutComponent } from './pages/users/logout/logout.component';
import { ProfileComponent } from './pages/users/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { AuthGuard } from './system/guard/auth.guard';
import { AuthAdminGuard } from './system/guard/auth-admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'medias', component: MediasComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
