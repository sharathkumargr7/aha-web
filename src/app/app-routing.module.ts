import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicGridComponent } from './components/music-grid/music-grid.component';
import { YouTubeCallbackComponent } from './components/youtube-callback.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: MusicGridComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'oauth2callback', component: YouTubeCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
