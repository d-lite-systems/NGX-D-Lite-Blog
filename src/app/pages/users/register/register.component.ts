import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../../system/services/user.service';
import { SnackBarComponent } from '../../../system/snack-bar/snack-bar.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;

  registerForm: FormGroup;
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public snackbar: SnackBarComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password
    });
  }

  setClassUsername() {
    return this.username.hasError('required') ? 'You must enter a value' :
        this.username.hasError('username') ? 'Not a valid username' :
            '';
  }

  setClassEmail() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  setClassPassword() {
    return this.password.hasError('required') ? 'You must enter a value' :
        this.password.hasError('password') ? 'Not a valid password' :
            '';
  }

  register() {
    this.userService.register(this.registerForm.value).subscribe(
      res => {
        this.snackbar.setMessage('you successfully registered!', 'success');
        this.router.navigate(['/login']);
      },
      error => this.snackbar.setMessage('email already exists', 'danger')
    );
  }
}
