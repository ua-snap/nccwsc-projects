import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects.component";

export const ProjectsRoutes: Routes = [
  { path: "projects/:id", component: ProjectsComponent },
];
