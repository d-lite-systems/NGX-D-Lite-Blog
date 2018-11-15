import { AfterViewChecked,  ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';

import { AuthService } from '../../system/services/auth.service';
import { CategoryService } from '../../system/services/category.service';
import { MediaService } from '../../system/services/media.service';
import { TaskService } from '../../system/services/task.service';

import { Category } from '../../system/models/category';
import { Media } from '../../system/models/media';
import { Task } from '../../system/models/task';

import { SnackBarComponent } from '../../system/snack-bar/snack-bar.component';

const colors: any = {
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.tasks = this.tasks.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];
  activeDayIsOpen: boolean = true;
  addTaskForm: FormGroup;
  categories: Category[] = [];
  displayedColumns: string[] = ['title', 'primarycolor', 'secondarycolor', 'startsat', 'endsat', 'actions'];
  medias: Media[] = [];
  tasks: Task[] = [];  
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5 ,10, 20, 50, 100];
  refresh: Subject<any> = new Subject();
  view: string = 'month';
  viewDate: Date = new Date();
  
  category = new Category();
  currentPage = 1;
  content = new FormControl('', Validators.required);
  dataSource = new MatTableDataSource<Task>([]);
  isLoading = true;
  isEditing = false;
  isRateLimitReached = false;
  media = new Media();
  nbTasks = 0;
  nbMedias = 0;
  nbCategories = 0;
  pageSize = 10;
  selectedCategories = [];
  task = new Task();
  title = new FormControl('', Validators.required);
  color = {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  };
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;
  
  constructor(public auth: AuthService,
              public dialog: MatDialog,
              public snackbar: SnackBarComponent,
              private categoryService: CategoryService,
              private changeDetector: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private mediaService: MediaService,
              private taskService: TaskService) { }

  addEvent(): void {
    this.task = {
      categories:[],
      comments:[],
      color: this.color,
      createdAt: new Date(),
      draggable: true,
      end: endOfDay(new Date()),
      media:{},
      public: true,
      published: true,
      recycled: false,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      start: startOfDay(new Date()),
      title: 'New event',
      updated: [],
      user: this.auth.currentUser      
    }

  }

  addTask(task: Task){

    task.title = this.addTaskForm.value.title;
    task.content = this.addTaskForm.value.content;
    task.media = this.media;
    task.categories = this.selectedCategories;
    task.user = this.auth.currentUser; 
    console.log(task)
    this.taskService.addTask(task).subscribe(
      res => {
        this.getTasks();
        this.snackbar.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }
  cancelEditing() {
    this.isEditing = false;
    this.task = new Task();
    this.snackbar.setMessage('item editing cancelled.', 'warning');
    // reload the tasks to reset the editing
    this.getTasks();
    this.addTaskForm.reset();
  }

  countTasks() {
    this.taskService.countTasks().subscribe(
      data => {
        this.nbTasks = data;
        this.isLoading = false
      },
      error => console.log(error)
    );
  }

  countCategories() {
    this.categoryService.countCategories().subscribe(
      data => {
        this.nbCategories = data;
      },
      error => console.log(error)
    );
  }

  countMedias() {
    this.mediaService.countMedias().subscribe(
      data => {
        this.nbMedias = data;
      },
      error => console.log(error)
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  editTask(task: Task) {
    task.title = this.addTaskForm.value.title;
    task.media = this.media;
    task.content = this.addTaskForm.value.content;
    task.categories = this.selectedCategories
    this.taskService.editTask(task).subscribe(
      () => {
        this.isEditing = false;
        this.getTasks();
        this.addTaskForm.reset();
        this.snackbar.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteTask(task: Task) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.taskService.deleteTask(task).subscribe(
        () => {
          this.getTasks()
          this.snackbar.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  enableEditing(task: Task) {
    this.isEditing = true;
    this.task = task;
    this.media = this.task.media;    
    this.selectedCategories = [];
    for(var category in task.categories) {
      this.selectedCategories.push(category)
    }
    this.addTaskForm = this.formBuilder.group({
      title: this.task.title,
      content: this.task.content,
      media: this.task.media,
      categories: this.task.categories,
      user: this.auth.currentUser
    });
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef = this.dialog.open(TaskOverviewDialog, {
      data: {event, action}
    });   
  }

  getCategories() {
    this.categoryService.getCategories({currentPage: this.currentPage, perPage: this.pageSize}).subscribe(
      data => {
        this.categories = data;
        this.selectedCategories.push(this.categories[0])
      },
      error => console.log(error)
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

  getTasks() {
    this.taskService.getTasks({currentPage: this.currentPage, perPage: this.pageSize}).subscribe(
      data => {
        this.tasks = data.map(function(task) {
          task.start = new Date(task.start);
          task.end = new Date(task.end);
          return task
        })
        this.addEvent();
        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.countTasks();
        this.addTaskForm = this.formBuilder.group({
          title: this.title,
          content: this.content,
          media: this.media,
          user: this.auth.currentUser,
          color: {},
          categories: this.selectedCategories,
          updated:[],
          public: true,
          published: true,
          start: new Date(),
          end: new Date(),
          comments:[]
        });   
      },
      error => console.log(error)
    );
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getCategories();
    this.getMedias();
    this.countMedias();
    this.addTaskForm = this.formBuilder.group({
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
    this.getTasks();
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
    this.getTasks() 
  }  

}

@Component({
  selector: 'task-overview-dialog',
  template: `<h1 mat-dialog-title>{{data.title}}</h1>
             <div class="dlb-dialog-content">
               <div mat-dialog-content  [style.background]="data.color.secondary">
                <div class="dlb-dialog-content">
                  <mat-list [style.background]="data.color.primary">
                    <h3 mat-subheader>Description</h3>

                    <mat-list-item><mat-icon mat-list-icon>schedule</mat-icon> Start At : {{ data.start | date:'medium' }}</mat-list-item>
                    <mat-list-item><mat-icon mat-list-icon>schedule</mat-icon> End At : {{ data.end | date:'medium'}}</mat-list-item>
                    
                  </mat-list>
                </div>
               </div>
             </div>
             <div mat-dialog-actions>
               <button mat-button (click)="onNoClick()">OK</button>               
             <div>`,
})
export class TaskOverviewDialog {
  constructor(
    public dialogRef: MatDialogRef<TaskOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarEvent) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}