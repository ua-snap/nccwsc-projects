import { Routes } from "@angular/router";
import { ProjectComponent } from "./project.component";

export const ProjectRoutes: Routes = [
  { path: "project/:csc/:id", component: ProjectComponent },
];
