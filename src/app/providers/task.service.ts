
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { TaskModel } from '../Model/taskModel';
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }
  serviceName = environment.apiUrl + "/tasks";
  getHeaders() {
    let header = new HttpHeaders();({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.getToken()
    });
    return { headers :  header };
  }

createOrUpdate(_id : string)
{
    if (_id == null)
       return "create/";
    return "update";
}

  //Security token to access api's
  getToken()
  {
      return "32234kjhj2hjk23hjkh4545h4khj34k2h5kj34h5j";
  }

  find(state : string = "", order? : string)
  { 
    if (order == null)
      order = "-1";
    if (state != "")  
        state = "state=" + state;

     return  this.http.get (this.serviceName + "?" + state + "&$sort[createdAt]="+order , this.getHeaders())    
  }

  remove (_id : string)
  {
    var data = { _id : _id }
    return this.http.delete (this.serviceName + "/" + _id , this.getHeaders());
  }

  get(_id : string)
  {
    return this.http.get<TaskModel> (this.serviceName + "/" +_id , this.getHeaders());
  }
  
  complete(_id : string)
  {
    return this.http.patch (this.serviceName  + "/" + _id, {  state : "D"},  this.getHeaders());
  }

  save (task : TaskModel)
  {       
       if (task._id == null)
          return this.http.post(this.serviceName , task);   
       else
          return this.http.patch (this.serviceName  + "/" + task._id, {  name : task.name },  this.getHeaders());
  }


}
