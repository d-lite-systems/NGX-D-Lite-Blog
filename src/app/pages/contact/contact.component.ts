import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ContactService } from '../../system/services/contact.service';
import { SnackBarComponent } from '../../system/snack-bar/snack-bar.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
 public Editor = ClassicEditor;
  contactForm: FormGroup;
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
	subject = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  text = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(300)
  ]);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public snackbar: SnackBarComponent,
              private contactService: ContactService
              ) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      email: this.email,
      name: this.name,
      subject: this.subject,
      text: this.text
    });
  }

  setClassEmail() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  setClassName() {
    return this.name.hasError('required') ? 'You must enter a value' :
        this.name.hasError('name') ? 'Not a valid name' :
            '';
  }
  setClassSubject() {
    return this.subject.hasError('required') ? 'You must enter a value' :
        this.subject.hasError('subject') ? 'Not a valid subject' :
            '';
  }

  setClassText() {
    return this.text.hasError('required') ? 'You must enter a value' :
        this.text.hasError('text') ? 'Not a valid message' :
            '';
  }

  sendMail() {
    this.contactService.addContact(this.contactForm.value).subscribe(
      res => {
        this.snackbar.setMessage('you successfully registered!', 'success');
        this.email = new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]);
        this.name = new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]);
        this.subject = new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]);
        this.text = new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(300)
        ]);
        this.contactForm = this.formBuilder.group({
          email: this.email,
          name: this.name,
          subject: this.subject,
          text: this.text
        });
      },
      error => this.snackbar.setMessage('email already exists', 'danger')
    );

  }

}
