import { Component, OnInit } from '@angular/core';
import { SnackBarComponent } from '../../../system/snack-bar/snack-bar.component';
import { AuthService } from '../../../system/services/auth.service';
import { UserService } from '../../../system/services/user.service';
import { User } from '../../../system/models/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user= new User();
  isLoading = true;

  constructor(private auth: AuthService,
              public snackbar: SnackBarComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => this.user = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  save(user: User) {
    this.userService.editUser(user).subscribe(
      res => this.snackbar.setMessage('account settings saved!', 'success'),
      error => console.log(error)
    );
  }

}
