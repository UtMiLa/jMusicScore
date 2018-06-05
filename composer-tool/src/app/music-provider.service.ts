import { Injectable } from '@angular/core';
//import { Observable } from '@angular/observable';
import {IModel} from './datamodel/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MusicProviderService {

  constructor(private http: HttpClient) {
    //this.load();
  }

  json: IModel;
  loadUrl = 'http://localhost:8081/getFile/users1.json';
  saveUrl = 'http://localhost:8081/saveFile/users1.json';

  load(): Observable<IModel> {
    return this.http.get<IModel>(this.loadUrl);
  }

  saveModel(model: IModel): Observable<string[]>{
        return this.http.post<string[]>(this.saveUrl, "text="+JSON.stringify(model));
  }

  getVariables(id: string){
    var varList = this.json[id];
    return varList;
  }
  getModel(): Observable<IModel> {
    return this.load();
  }

  dummy(){
/*    
    function appendObjToList(listId, obj) {
      //  alert("append");
        var list = document.getElementById(listId);
        for(var v in obj) {
            var $li = $("<li>").appendTo(list);
                    
            $li.text(v).data("name", v).click(function(ev) {
                var $target = $(ev.target);
                var name = $target.data("name");
                var data = obj[name];
                $(vartext).val(data).data("varName", $target.text()).data("obj", obj);
            });
        }
    }
    //alert("b");
    
        for(var v in data.sections) {
            $('<option>').text(v).val("sections_"+v).appendTo("#sectionChooser");
            var $li = $("<li>").appendTo("#sections");
            var $list = $("<ul>").appendTo($li).attr("id", "sections_"+v);
            appendObjToList("sections_"+v, data.sections[v].voices);
        }
    
    $("#sectionChooser").change(function(){
        var v = $("#sectionChooser").val();
        $("#sections>li").hide();
        $("#" + v).parent().show();
    });
    //alert("c");
    $("#sections>li").hide();
    if (data.voices.sections.length){
        $("#sectionChooser").val("sections_" + data.voices.sections[0]);
        $("#sections_" + data.voices.sections[0]).parent().show();
    }
    
    elm.value = JSON.stringify(data);
    
    $("#addNewVar").click(function(){
        //alert("click");
        var name= $("#newVar").val();
        data.variables[name] = "";
        $("#variables").empty();
        appendObjToList("variables", data.variables);
        $(elm).val(JSON.stringify(data));
    });
    //alert("d");
    
    $("#sectionlist").val(data.voices.sections.join("\n")).change(function(){
        data.voices.sections = $("#sectionlist").val().split("\n");
        $(elm).val(JSON.stringify(data));
    });
    $("#voices").val(data.voices.voices.join("\n")).change(function(){
        data.voices.voices = $("#voices").val().split("\n");
        $(elm).val(JSON.stringify(data));
    });
    
    $("#opretSecVoices").click(function(){
        var changed = false;
        for(var j = 0; j < data.voices.sections.length; j++) {
            var section = data.voices.sections[j];
            if (!data.sections[section]){
                data.sections[section] = {voices: {}};
                changed = true;
            }
            var theSection = data.sections[section];
            for(var i = 0; i < data.voices.voices.length; i++) {
                var voice = data.voices.voices[i];
                if (!theSection.voices[voice + section]){
                    theSection.voices[voice + section] = "{ }";
                    changed = true;
                }
            }
        }
        if (changed) $(elm).val(JSON.stringify(data));
    
    });*/
      }



}
