import { Routes, RouterModule } from "@angular/router";
import { ProjectResourceComponent } from "./project-resource.component";

export const ProjectResourceRoutes: Routes = [
  { path: "component/:sbId", component: ProjectResourceComponent },
];
