import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';

import { ArticleService } from '../../system/services/article.service';
import { AuthService } from '../../system/services/auth.service';
import { MediaService } from '../../system/services/media.service';
import { CategoryService } from '../../system/services/category.service';
import { SnackBarComponent } from '../../system/snack-bar/snack-bar.component';
import { Article } from '../../system/models/article';
import { Category } from '../../system/models/category';
import { Media } from '../../system/models/media';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, AfterViewChecked {
  addArticleForm: FormGroup;
  articles: Article[] = [];
  categories: Category[] = [];  
  dataSource: MatTableDataSource<Article>;
  displayedColumns: string[] = ['title', 'content', 'createdAt'];
  medias: Media[] = [];
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5 ,10, 20, 50, 100];

  article = new Article();
  category = new Category();
  content = new FormControl('', Validators.required);
  currentPage = 1;
  isLoading = true;
  isEditing = false;
  isRateLimitReached = false;
  media = new Media();
  nbArticles = 0;
  nbMedias = 0;
  nbCategories = 0;
  pageSize = 10;
  selectedCategories = [];
  title = new FormControl('', Validators.required);

  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;

  constructor(public auth: AuthService,
              public snackbar: SnackBarComponent,
              private articleService: ArticleService,
              private categoryService: CategoryService,
              private changeDetector: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private mediaService: MediaService) { }

  addArticle() {
    this.addArticleForm.value.media = this.media;
    this.addArticleForm.value.categories = this.selectedCategories;

    this.articleService.addArticle(this.addArticleForm.value).subscribe(
      res => {
         this.getArticles();
        this.addArticleForm.reset();
        this.snackbar.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  cancelEditing() {
    this.isEditing = false;
    this.article = new Article();
    this.snackbar.setMessage('item editing cancelled.', 'warning');
    // reload the articles to reset the editing
    this.getArticles();
    this.addArticleForm.reset();
  }

  countArticles() {
    this.articleService.countArticles().subscribe(
      data => {
        this.nbArticles = data;
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

  countMedias() {
    this.mediaService.countMedias().subscribe(
      data => {
        this.nbMedias = data;
        this.isLoading = false
      },
      error => console.log(error)
    );
  }

  deleteArticle(article: Article) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.articleService.deleteArticle(article).subscribe(
        () => {
          this.getArticles();
          this.snackbar.setMessage('item deleted successfully.', 'success');
          this.addArticleForm.reset();
        },
        error => console.log(error)
      );
    }
  }

  editArticle(article: Article) {
    article.title = this.addArticleForm.value.title;
    article.media = this.media;
    article.content = this.addArticleForm.value.content;
    article.categories = this.selectedCategories
    this.articleService.editArticle(article).subscribe(
      () => {
        this.isEditing = false;
        this.getArticles();
        this.addArticleForm.reset();
        this.snackbar.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(article: Article) {
    this.isEditing = true;
    this.article = article;
    this.media = this.article.media;    
    this.selectedCategories = [];
    for(var category in article.categories) {
      this.selectedCategories.push(category)
    }
    this.addArticleForm = this.formBuilder.group({
      title: this.article.title,
      content: this.article.content,
      media: this.article.media,
      categories: this.article.categories,
      user: this.auth.currentUser
    });
  }

  getArticles() {
    this.articleService.getArticles({currentPage: this.currentPage, perPage: this.pageSize}).subscribe(
      data => {
        this.articles = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.countArticles();   
        this.addArticleForm = this.formBuilder.group({
          title: this.title,
          content: this.content,
          media: this.media,
          user: this.auth.currentUser,
          categories: this.selectedCategories,
          updated:[],
          public: true,
          published: true,
          start: new Date(),
          end: new Date(),
          comments:[]
        });
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getCategories() {
    this.categoryService.getCategories({currentPage: this.currentPage, perPage: this.pageSize}).subscribe(
      data => {
        this.categories = data;
        this.selectedCategories.push(this.categories[0])
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

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
    if(this.auth.loggedIn) {
      this.displayedColumns = ['title', 'content', 'categories','createdAt','image', 'actions'];  
    }
  }

  ngOnInit() {
    this.countMedias();
    this.getArticles();
    this.getCategories();
    this.getMedias();
    this.addArticleForm = this.formBuilder.group({
      title: this.title,
      content: this.content,
      media: this.media,
      user: this.auth.currentUser,
      categories: this.selectedCategories,
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

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    this.getArticles() 
  }

}
