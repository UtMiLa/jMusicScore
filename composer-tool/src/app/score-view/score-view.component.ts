import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-view',
  templateUrl: './score-view.component.html',
  styleUrls: ['./score-view.component.css']
})
export class ScoreViewComponent implements OnInit {

  constructor() { }
  
  images: any[];

  @Input() set files(value: string[]) { 
    this.images = [];
    if (value)
    for (var i = 0; i < value.length; i++) {
      this.images.push({source:'http://localhost:8081/getFile/' + value[i], alt:'Side ' + i, title:'Side ' +i});
  }
  }

  get files(): string[] { 
    var res = [];
    //this.images
    return res;
  }

  ngOnInit() {

  }

}
