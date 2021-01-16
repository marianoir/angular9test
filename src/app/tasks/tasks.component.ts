import { TaskService } from './../providers/task.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js';
import {Location} from '@angular/common';
import { TaskModel } from '../Model/taskModel';

import { from } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.sass']
})
export class TasksComponent implements OnInit {
  @ViewChild('lineChart', {static: false})  lineChart: ElementRef  ;
  

  tasks = []; // tasks list
  taskName : any;
  isList = true;  // which screen to show (list or form)
  message = "";   // pop up message;
  _id : string ; //chosen task to edit
  charts =  []; // chart data
  chart : any;
  

   state = "I"; // state default (incomplete)

  constructor(private taskService : TaskService  ,
              private location : Location
    ) { }

  ngOnInit(): void {

        this.find(this.state);
       
  }

  get()
  {
       alert (this.lineChart.nativeElement)
  }
  // Refresh default list.
  find(state : string): void {    
      this.isList = true;
      this.state = state;
      this.taskService.find(state).subscribe(result => {    
        this.tasks = result["data"];        
      })
      this.updateChart();
  }

  emptyTask ()
  {
    this._id = null;
    this.isList = false;
    this.taskName = "";
  }
  //open new task form
  newTask ()
  {
      this.emptyTask();
  }

  //editing a task
  editTask (_id : string)
  {
       this._id = _id;
       this.taskService.get(_id).subscribe(t => {
          this.isList = false;
          this._id = _id;
          this.taskName = t.name;
       }) 
  }

  //saving a task
  save (_id : string)
  {     
       if (this.taskName == null || this.taskName == "")
       {
              alert ("Task name is mandatory")
              return false;
       }       
       var taskModel = new TaskModel();
       if (_id == null)
       { 
          taskModel.state = "I";
       } else {
          taskModel._id = _id
       }     
       taskModel.name = this.taskName;      
       this.taskService.save(taskModel).subscribe(x=> {
            this.find(this.state);
       })
  } 

  //deleting a task
  deleteTask (_id : string)
  {
    this.taskService.remove(_id).subscribe(t => {
          //Come back to the main list.
          this.find(this.state);
    }) 
  }

    //mark task as completed
  completeTask (_id : string)
    {
      this.taskService.complete(_id).subscribe(t => {
            //Come back to the main list.           
            this.find(this.state);  
      }) 
    }

  goBack()
  {
    this.updateChart();
    this.isList = true;
  }


  ngAfterViewInit()
  {
    //setTimeout( this.createChart, 5000);
    //this.updateChart();
  
     
  }
  
  cutHours (date : Date){
  
     var hour = new Date(date).getHours();
    
     return  hour;

  }

  updateChart()
  {
    
        this.charts.length = 0;
        this.taskService.find(this.state,"1").subscribe(list=> {
            
            var result : any = list["data"];
            
            for (let i = 0 ; i < result.length; i++)
            {               
              var hour =    this.cutHours(result[i]["createdAt"]);
              var name = result[i]["name"];
              var charQ = name.length;     
              console.log(name + " " + charQ);        
              if (this.charts.filter(x => x.x == hour)[0] != null)
              {               
                this.charts.filter(x => x.x == hour)[0]["y"] = this.charts.filter(x => x.x == hour)[0]["y"] + charQ;
              } else {
                this.charts.push({ x : hour , y : charQ })    
              }
            }
         //   console.log(this.charts);

              
            var chartX = this.charts.map(function(a) {return a.x;});
          /*  chartX.sort(function(a, b) {
              return a - b;
            });*/
            
            var chartY = this.charts.map(function(a) {return a.y;});
          /*  chartY.sort(function(a, b) {
              return a - b;
            });*/
            this.createChart(chartX,chartY)
            

        })

  }


  createChart(chartX, chartY)
  {
    // console.log(chartY)
    this.chart = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: chartX, // your labels array
        datasets: [
          {
            data: chartY, // your data array
            borderColor: '#00AEFF',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });


  }
  


}
