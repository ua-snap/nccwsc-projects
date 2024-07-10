// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  version: "4.3.1-dev",
  production: false,
  baseURL: "https://my.usgs.gov/casc",
  serviceURL: "https://my.usgs.gov/casc-service",
  sbmainURL: "https://www.sciencebase.gov",
  projectsPath: "/projects/#",
  urlPrefix: "/casc/",
};
