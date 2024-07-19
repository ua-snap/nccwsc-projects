import { Routes } from "@angular/router";
import { TopicsComponent } from "./topics.component";

export const TopicsRoutes: Routes = [
  { path: "topics/:topic", component: TopicsComponent },
];
