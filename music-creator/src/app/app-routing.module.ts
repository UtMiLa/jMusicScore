import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './pages/project/project.component';


const routes: Routes = [
  {path: 'project' , component: ProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
