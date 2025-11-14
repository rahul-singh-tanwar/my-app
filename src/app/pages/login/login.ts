import { Component  } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../utils/AuthService';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    this.loading = true;
    this.errorMessage = '';

    try {
      const response = await this.authService.login(this.username, this.password);
      console.log('Login successful:', response);
      
      // Redirect to dashboard (or another route)
      this.router.navigate(['/prearrangement']);
    } catch (error: any) {
      console.error('Login errsssor:', error);
      this.errorMessage = 'Invalid credentials or server error';
      this.router.navigate(['prearrangement']);
    } finally {
      this.loading = false;
    }
  }

}
