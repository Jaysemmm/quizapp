import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  results = [
    { id: 1, quiz: 'Basic Algebra', score: 85, total: 100, date: '2024-01-15', status: 'Passed' },
    { id: 2, quiz: 'Geometry Fundamentals', score: 72, total: 100, date: '2024-01-14', status: 'Passed' },
    { id: 3, quiz: 'Calculus Advanced', score: 65, total: 100, date: '2024-01-13', status: 'Passed' },
    { id: 4, quiz: 'Trigonometry', score: 90, total: 100, date: '2024-01-12', status: 'Passed' }
  ];

  averageScore = 78;

  getScoreColor(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }
}
