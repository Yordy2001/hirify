import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerFormGroup: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerFormGroup = new FormGroup({
      tenant: new FormControl('', [Validators.required]),
      nameEmpresa: new FormControl('', [Validators.required]),
      nameAdmin: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl(''.trim(), [Validators.required, Validators.maxLength(8)]),
    })
  }

  register() {
    const data = {
      name: this.registerFormGroup.value.nameEmpresa,
      logo: '',
      subdomain: this.registerFormGroup.value.tenant.trim().toLocaleLowerCase(),
      colors: {
        primary:"blanco"
      },
      adminData: {
        name: this.registerFormGroup.value.nameAdmin, 
        email:this.registerFormGroup.value.email,
        password: this.registerFormGroup.value.password,
        role: ["admin"]
      }
    }
    this.authService.register(data).subscribe({
      next: (res) => {
        this.router.navigate(['/login'])
      },
      error: (err) => {
        alert(err)
      }
    });
  }

}
