import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
  GridReadyEvent,
} from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { MusicService } from '../../services/music.service';
import { YouTubeService } from '../../services/youtube.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AhaMusic } from '../../models/aha-music.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-music-grid',
  template: `
    <div class="grid-container">
      <div class="button-container">
        <button mat-raised-button color="primary" (click)="importCsv()">Import CSV</button>
        <button mat-raised-button color="accent" (click)="cleanupDuplicates()">
          Clean Duplicates
        </button>
        <button mat-raised-button (click)="loadData()">Refresh Data</button>
        <button mat-raised-button color="warn" (click)="createYouTubePlaylist()">
          Create YouTube Playlist
        </button>
      </div>
      <ag-grid-angular
        class="ag-theme-alpine"
        [rowData]="rowData"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [animateRows]="true"
        [rowSelection]="'multiple'"
        [sortingOrder]="['desc', 'asc', null]"
        [pagination]="true"
        [paginationPageSize]="20"
        (gridReady)="onGridReady($event)"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .grid-container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .button-container {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }

      ag-grid-angular {
        width: 100%;
        flex: 1;
        min-height: 400px;
        display: block;
      }

      :host ::ng-deep .url-cell {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      :host ::ng-deep .url-cell a {
        color: #1976d2;
        text-decoration: none;
      }

      :host ::ng-deep .url-cell a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class MusicGridComponent implements OnInit {
  private gridApi!: GridApi;
  public rowData: AhaMusic[] = [];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    unSortIcon: true,
  };

  public columnDefs: ColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      minWidth: 200,
      sort: 'asc',
    },
    {
      field: 'artists',
      headerName: 'Artists',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 1,
      minWidth: 160,
      sort: 'desc',
      sortIndex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      },
      comparator: (valueA: string, valueB: string) => {
        const dateA = new Date(valueA).getTime();
        const dateB = new Date(valueB).getTime();
        return dateA - dateB;
      },
    },
    {
      field: 'addedToPlaylist',
      headerName: 'Added',
      flex: 0.5,
      minWidth: 80,
      sort: 'asc',
      sortIndex: 0,
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? '✓' : '';
      },
      sortable: false,
    },
    {
      field: 'sourceUrl',
      headerName: 'Source',
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) => {
        if (params.value) {
          const div = document.createElement('div');
          div.className = 'url-cell';

          const url = new URL(params.value);
          const displayText = url.hostname + url.pathname;

          const link = document.createElement('a');
          link.href = params.value;
          link.target = '_blank';
          link.title = params.value; // Show full URL on hover
          link.innerHTML = displayText;

          div.appendChild(link);
          return div;
        }
        return '';
      },
      comparator: (valueA: string, valueB: string) => {
        try {
          const urlA = new URL(valueA);
          const urlB = new URL(valueB);
          return urlA.hostname.localeCompare(urlB.hostname);
        } catch {
          return 0;
        }
      },
    },
    {
      field: 'detailUrl',
      headerName: 'Details',
      flex: 1,
      minWidth: 120,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => {
        if (params.value) {
          const link = document.createElement('a');
          link.href = params.value;
          link.target = '_blank';
          link.innerHTML = 'Details';
          link.classList.add('mat-button');
          return link;
        }
        return '';
      },
    },
  ];

  constructor(
    private musicService: MusicService,
    private youTubeService: YouTubeService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Check for access token in URL parameters (from OAuth redirect)
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      if (accessToken) {
        localStorage.setItem('youtube_access_token', accessToken);
        this.showMessage('Successfully authenticated with YouTube!');
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Notify other components about login status change
        window.dispatchEvent(new CustomEvent('youtube-login-status-changed'));
      }
    });

    this.loadData();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();

    // Add resize listener
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      });
    });
  }

  loadData() {
    // Load all data for client-side pagination
    // For large datasets, you could implement chunked loading here
    this.musicService.getAllMusic().subscribe({
      next: data => {
        this.rowData = data;
        if (this.gridApi) {
          this.gridApi.sizeColumnsToFit();
        }
      },
      error: error => {
        this.showMessage('Error loading data: ' + error.message);
      },
    });
  }

  importCsv() {
    this.musicService.importCsv().subscribe({
      next: response => {
        this.showMessage(response);
        this.loadData();
      },
      error: error => {
        this.showMessage('Error importing CSV: ' + error.message);
      },
    });
  }

  cleanupDuplicates() {
    this.musicService.cleanupDuplicates().subscribe({
      next: response => {
        this.showMessage(response);
        this.loadData();
      },
      error: error => {
        this.showMessage('Error cleaning up duplicates: ' + error.message);
      },
    });
  }

  createYouTubePlaylist() {
    if (!this.gridApi) {
      this.showMessage('Grid not ready yet');
      return;
    }

    // Get the first 5 displayed rows in the grid
    const songs: AhaMusic[] = [];
    for (let i = 0; i < 5; i++) {
      const rowNode = this.gridApi.getDisplayedRowAtIndex(i);
      if (rowNode?.data) {
        songs.push(rowNode.data);
      }
    }

    if (songs.length === 0) {
      this.showMessage('No songs available to create playlist');
      return;
    }

    // Show loading message for the songs
    const loadingMessage = this.snackBar.open(
      `Searching YouTube for ${songs.length} song${songs.length > 1 ? 's' : ''}...`,
      'Close',
      {
        duration: 0, // Keep open until dismissed
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      },
    );

    // Prepare request with the selected songs
    const songRequests = songs.map(song => ({
      title: song.title,
      artists: song.artists,
    }));

    // Call backend to create playlist
    this.youTubeService.createPlaylist(songRequests).subscribe({
      next: response => {
        loadingMessage.dismiss();

        if (response.error) {
          this.showMessage('Error: ' + response.error);
          return;
        }

        if (response.playlistUrl) {
          // Mark songs as added
          songs.forEach(song => (song.addedToPlaylist = true));
          this.gridApi.refreshCells({ force: true });

          // Do NOT auto-open the playlist. Copy URL to clipboard (best-effort)
          try {
            navigator.clipboard?.writeText(response.playlistUrl);
          } catch (e) {
            // ignore clipboard errors
          }

          const message = `Found ${response.videoCount} of ${response.requestedCount} songs. Playlist created.`;

          // Show a persistent snackbar with an 'Open' action so the user can open it intentionally
          const snackRef = this.snackBar.open(message, 'Open', {
            duration: 0,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          snackRef.onAction().subscribe(() => {
            window.open(response.playlistUrl, '_blank');
          });

          // Let the user know we copied the URL (if supported)
          this.showMessage('Playlist URL copied to clipboard (if available).');
        } else {
          this.showMessage('No playlist URL returned');
        }
      },
      error: error => {
        loadingMessage.dismiss();
        const errorMessage = error.error?.error || error.message || 'Unknown error';
        this.showMessage('Error creating playlist: ' + errorMessage);
      },
    });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
