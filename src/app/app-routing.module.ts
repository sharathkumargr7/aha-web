import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicGridComponent } from './components/music-grid/music-grid.component';
import { YouTubeCallbackComponent } from './components/youtube-callback.component';

const routes: Routes = [
  { path: '', component: MusicGridComponent },
  { path: 'oauth2callback', component: YouTubeCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
