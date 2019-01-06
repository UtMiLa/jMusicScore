import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageFilesComponent } from './page-files/page-files.component';
import { PageProjectComponent } from './page-project/page-project.component';
import { PageVariablesComponent } from './page-variables/page-variables.component';
import { PageSectionsComponent } from './page-sections/page-sections.component';
import { PageScoreComponent } from './page-score/page-score.component';

const routes: Routes = [
    {path: 'files' , component: PageFilesComponent},
    {path: 'project' , component: PageProjectComponent},
    {path: 'variables' , component: PageVariablesComponent},
    {path: 'sections' , component: PageSectionsComponent},
    {path: 'music' , component: PageProjectComponent},
    {path: 'score' , component: PageScoreComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
