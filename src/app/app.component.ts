import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary">
        <span>Aha Music Grid</span>
      </mat-toolbar>
      <div class="content">
        <app-music-grid></app-music-grid>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }

      .content {
        flex: 1;
        overflow: hidden;
        padding: 20px;
      }
    `,
  ],
})
export class AppComponent {}
