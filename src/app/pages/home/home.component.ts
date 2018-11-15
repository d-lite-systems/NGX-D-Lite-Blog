import { Component, OnInit } from '@angular/core';

import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 slides = [{
  src: './assets/img/slide01.jpg', 
  title:'<img src="./assets/icons/icon-512x512.png" class="img-fluid">', 
  subtitle:'<h1>NGX D-Lite Blog</h1>'
},{
  src: './assets/img/slide02.jpg', 
  title:'<img src="./assets/icons/icon-512x512.png" class="img-fluid">', 
  subtitle:'<h1>NGX D-Lite Blog</h1>'
},{
  src: './assets/img/slide03.jpg', 
  title:'<img src="./assets/icons/icon-512x512.png" class="img-fluid">', 
  subtitle:'<h1>NGX D-Lite Blog</h1>'
}];
  constructor(config: NgbCarouselConfig) {
	config.interval = 5000;
   }

  ngOnInit() {
  }

}
