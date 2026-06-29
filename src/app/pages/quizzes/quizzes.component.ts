import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.css'
})
export class QuizzesComponent {
  quizzes = [
    { id: 1, title: 'Basic Algebra', difficulty: 'Easy', questions: 10, duration: '15 mins' },
    { id: 2, title: 'Geometry Fundamentals', difficulty: 'Medium', questions: 15, duration: '25 mins' },
    { id: 3, title: 'Calculus Advanced', difficulty: 'Hard', questions: 20, duration: '40 mins' },
    { id: 4, title: 'Trigonometry', difficulty: 'Medium', questions: 12, duration: '20 mins' }
  ];

  getDifficultyColor(difficulty: string): string {
    const colors: { [key: string]: string } = {
      'Easy': 'easy',
      'Medium': 'medium',
      'Hard': 'hard'
    };
    return colors[difficulty] || '';
  }
}
