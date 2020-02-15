import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileIoService {


  loadUrl = 'http://localhost:3000/load/';
  listUrl = 'http://localhost:3000/list/mmodel';
  saveUrl = 'http://localhost:3000/save/';

  constructor(private http: HttpClient) { }

  list(ext: string){
    return this.http.get<string>(this.listUrl)
    .pipe(
      map((output) => {  typeof output === "string" ?  JSON.parse(output) : <any>output })
    );
  }

  load(name: string): Observable<string> {
    const model = this.http.get<string>(this.loadUrl + name);
    return model;
  }

  save(name: string, data: string){
    return this.http.post(this.saveUrl + name, data);
  }
}
