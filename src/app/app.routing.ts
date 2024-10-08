/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, RouterModule } from "@angular/router";
import { CscsRoutes } from "./cscs/cscs.routes";
import { CscRoutes } from "./csc/csc.routes";
import { TopicsRoutes } from "./topics/topics.routes";
import { ProjectRoutes } from "./project/project.routes";
import { ProjectResourceRoutes } from "./project-resource/project-resource.routes";

const appRoutes: Routes = [
  ...CscsRoutes,
  ...CscRoutes,
  ...TopicsRoutes,
  ...ProjectRoutes,
  ...ProjectResourceRoutes,
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(appRoutes, {});
