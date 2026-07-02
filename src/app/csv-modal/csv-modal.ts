import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface ImportStatus {
  status: 'queued' | 'processing' | 'completed' | 'not_found';
  processed: number;
  total: number;
  errors: string[];
}

interface ImportResponse extends ImportStatus {
  job_id: string;
}

@Component({
  selector: 'app-csv-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './csv-modal.html',
  styleUrl: './csv-modal.css'
})
export class CsvModalComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() importFinished = new EventEmitter<void>();

  selectedFile: File | null = null;
  isUploading = false;
  importStatus: ImportStatus | null = null;
  errorMessage = '';
  private pollHandle: any = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.errorMessage = '';
  }

  uploadCsv() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('csv', this.selectedFile);

    this.isUploading = true;
    this.errorMessage = '';

    this.http.post<ImportResponse>(`${environment.apiUrl}/subjects/import`, formData).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.importStatus = {
          status: res.status,
          processed: res.processed,
          total: res.total,
          errors: res.errors,
        };

        if (res.status === 'completed') {
          this.importFinished.emit();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isUploading = false;
        this.errorMessage = err.error?.message ?? 'Upload failed. Please try again.';
      }
    });
  }

  exportCsv() {
    this.http.get(`${environment.apiUrl}/subjects/export`, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subjects.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Export failed. Please try again.';
        console.error(err);
      }
    });
  }

  close() {
    if (this.pollHandle) clearInterval(this.pollHandle);
    this.selectedFile = null;
    this.importStatus = null;
    this.errorMessage = '';
    this.closed.emit();
  }
}
