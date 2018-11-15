import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, PageEvent } from '@angular/material';

import { SnackBarComponent } from '../../system/snack-bar/snack-bar.component';
import { AuthService } from '../../system/services/auth.service';
import { UserService } from '../../system/services/user.service';
import { User } from '../../system/models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['email', 'username', 'image', 'role', 'createdAt', 'actions'];
  
  pageEvent: PageEvent;
  users: User[] = [];

  currentPage = 1;
  dataSource = new MatTableDataSource<User>([]);
  pageSize = 10;
  isLoading = true;
  isRateLimitReached = false;
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public auth: AuthService,
              public snackbar: SnackBarComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers({currentPage: this.currentPage, perPage: this.pageSize}).subscribe(
      data => {
        this.users = data;
        this.dataSource = new MatTableDataSource(data);
        this.resultsLength = data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteUser(user: User) {
    if (window.confirm('Are you sure you want to delete ' + user.username + '?')) {
      this.userService.deleteUser(user).subscribe(
        data => this.snackbar.setMessage('user deleted successfully.', 'success'),
        error => console.log(error),
        () => this.getUsers()
      );
    }
  }

}
