import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent {
  subjects = [
    { id: 1, name: 'Mathematics', icon: '🔢', description: 'Learn core mathematical concepts' },
    { id: 2, name: 'Science', icon: '🔬', description: 'Explore scientific principles' },
    { id: 3, name: 'English', icon: '📝', description: 'Improve language skills' },
    { id: 4, name: 'History', icon: '🏛️', description: 'Discover historical events' }
  ];
}
