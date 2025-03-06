import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
  GridReadyEvent,
} from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { MusicService } from '../../services/music.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AhaMusic } from '../../models/aha-music.model';

@Component({
  selector: 'app-music-grid',
  template: `
    <div class="grid-container">
      <ag-grid-angular
        class="ag-theme-alpine"
        [rowData]="rowData"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [animateRows]="true"
        [rowSelection]="'multiple'"
        [sortingOrder]="['desc', 'asc', null]"
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
      }

      ag-grid-angular {
        width: 100%;
        height: 100%;
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
      sortIndex: 0,
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
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
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

  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
