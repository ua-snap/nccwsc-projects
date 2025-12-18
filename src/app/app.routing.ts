/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, RouterModule } from "@angular/router";
import { WarningComponent } from "./warning/warning.component";

const appRoutes: Routes = [
  { path: "", component: WarningComponent },
  { path: "**", component: WarningComponent },
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(appRoutes, {});
