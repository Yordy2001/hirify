import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  providers: [
    AuthService
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  loginFormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
  })

  constructor(
    private authService: AuthService,
  ) { }


  onLogin() {
    console.log(this.loginFormGroup.value);

    //   this.authService.login(this.email, this.password).subscribe(
    //     (response) => {
    //       console.log('Login successful:', response);
    //     },
    //     (error) => {
    //       console.error('Login failed:', error);
    //     },
    //   );
  }
}
