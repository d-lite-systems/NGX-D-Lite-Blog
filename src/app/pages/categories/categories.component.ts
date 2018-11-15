import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';

import { CategoryService } from '../../system/services/category.service';
import { MediaService } from '../../system/services/media.service';
import { AuthService } from '../../system/services/auth.service';
import { SnackBarComponent } from '../../system/snack-bar/snack-bar.component';
import { Category } from '../../system/models/category';
import { Media } from '../../system/models/media';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, AfterViewChecked {
  addCategoryForm: FormGroup;
  categories: Category[] = [];
  medias: Media[] = [];
  pageSizeOptions: number[] = [5 ,10, 20, 50, 100];
  displayedColumns: string[] = ['title', 'content', 'createdAt', 'image', 'actions'];
  pageEvent: PageEvent;
  dataSource : MatTableDataSource<Category>;  
  
  category = new Category();
  content = new FormControl('', Validators.required);
  currentPage = 1;
  isLoading = true;
  isEditing = false;
  isRateLimitReached = false;
  title = new FormControl('', Validators.required);
  media = new Media();
  
  nbMedias = 0;
  nbCategories = 0;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public auth: AuthService,
              private categoryService: CategoryService,
              private changeDetector: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private mediaService: MediaService,
              public snackbar: SnackBarComponent) { }

  ngOnInit() {
    this.getCategories();
    this.getMedias();
    this.countMedias();
    /* 
     * If the user changes the sort order, reset back to the first page.
     */
    this.addCategoryForm = this.formBuilder.group({
      title: this.title,
      content: this.content,
      media: this.media,
      user: this.auth.currentUser,
      updated:[],
      public: true,
      published: true,
      start: new Date(),
      end: new Date(),
      comments:[]
    });
  }

  setClassTitle() {
    return this.title.hasError('required') ? 'You must enter a value' :
        this.title.hasError('title') ? 'Not a valid title' :
            '';
  }

  setClassContent() {
    return this.content.hasError('required') ? 'You must enter a value' :
        this.content.hasError('content') ? 'Not a valid content' :
            '';
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
    if(this.auth.loggedIn) {
      this.displayedColumns = ['title', 'content',  'createdAt', 'image', 'actions'];  
    }
  }

  getCategories() {
    this.categoryService.getCategories({currentPage: this.currentPage, perPage: this.pageSize}).subscribe(
      data => {
        this.categories = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.countCategories();
    
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  countCategories() {
    this.categoryService.countCategories().subscribe(
      data => {
        this.nbCategories = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getMedias() {
    this.mediaService.getMedias({currentPage: 1, perPage: 5}).subscribe(
      data => {
        this.medias = data;
        this.media = this.medias[0]
      },
      error => console.log(error)
    );
  }

  countMedias() {
    this.mediaService.countMedias().subscribe(
      data => {
        this.nbMedias = data;
        this.isLoading = false
      },
      error => console.log(error)
    );
  }

  addCategory() {
    this.addCategoryForm.value.media = this.media
    this.categoryService.addCategory(this.addCategoryForm.value).subscribe(
      res => {
        this.getCategories();
        this.addCategoryForm.reset();
        this.snackbar.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(category: Category) {
    this.isEditing = true;
    this.category = category;
    this.media = this.category.media;    
    this.addCategoryForm = this.formBuilder.group({
      title: this.category.title,
      content: this.category.content,
      media: this.category.media,
      user: this.auth.currentUser
    });

  }

  cancelEditing() {
    this.isEditing = false;
    this.category = new Category();
    this.addCategoryForm.reset();
    this.snackbar.setMessage('item editing cancelled.', 'warning');
    // reload the categories to reset the editing
    this.getCategories();
  }

  editCategory(category: Category) {
    category.title = this.addCategoryForm.value.title;
    category.media = this.media;
    category.content = this.addCategoryForm.value.content;
    this.categoryService.editCategory(category).subscribe(
      () => {
        this.isEditing = false;
        this.getCategories();
        this.snackbar.setMessage('item edited successfully.', 'success');
        this.addCategoryForm.reset();
      },
      error => console.log(error)
    );
  }

  deleteCategory(category: Category) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.categoryService.deleteCategory(category).subscribe(
        () => {
          this.getCategories()
          this.snackbar.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);    
  }

}
