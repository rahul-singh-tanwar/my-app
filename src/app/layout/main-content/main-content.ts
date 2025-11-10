import { Component, signal} from '@angular/core';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.html',
  styleUrl: './main-content.css',
})
export class MainContent {

  selectedDepartment: string = 'IPD'; // default selected

  onDepartmentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDepartment = input.value;
  }

  getSelected(): void {
    console.log(this.selectedDepartment);
  }
}
