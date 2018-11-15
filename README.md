# AngularDLiteSystems

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.2.

## Prerequisites
1. Install [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com)
2. Install Angular CLI: `npm i -g @angular/cli`
3. From project root folder install all the dependencies: `npm i`

## CLI Workspaces
Since CLI v6, CLI workspaces containing multiple projects, such as multiple applications or libraries. CLI projects will now use angular.json instead of `.angular-cli.json` for build and project configuration.

Each CLI workspace has projects, each project has targets, and each target can have configurations.
```
{
  "projects": {
    "my-project-name": {
      "projectType": "application",
      "architect": {
        "build": {
          "configurations": {
            "production": {},
            "demo": {},
            "staging": {},
          }
        },
        "serve": {},
        "extract-i18n": {},
        "test": {},
      }
    },
    "my-project-name-e2e": {}
  },
}
```
## ng add

Another new CLI command ng add <package> makes adding new capabilities to your project easy. ng add will use your package manager to download new dependencies and invoke an installation script (implemented as a schematic) which can update your project with configuration changes, add additional dependencies (e.g. polyfills), or scaffold package-specific initialization code.

Try out some of the following on your fresh ng new application:

`ng add @angular/pwa` — Turn your application into a PWA by adding an app manifest and service worker
`ng add @ng-bootstrap/schematics` — Add ng-bootstrap to your application
`ng add @angular/material` — Install and setup Angular Material and theming and register new starter components into ng generate
`ng add @clr/angular@next` — Install and setup Clarity from VMWare
`ng add @angular/elements` — Add the needed `document-register-element.js` polyfill and dependencies for Angular Elements (see below)
Because ng add is built on top of schematics and the npm registry, our hope is that libraries and the community will help us build a rich ecosystem of ng add supporting packages.

e you have run `ng add @angular/material` to add material to an existing application, you will also be able to generate 3 new starter components.

### Material Sidenav

You can now generate a starter component including a toolbar with the app name and the side navigation. This component is responsive based on breakpoints.

Run: `ng generate @angular/material:material-nav --name=my-nav`

### Material Dashboard

You can now generate a starter dashboard component containing a dynamic grid list of cards.

Run: `ng generate @angular/material:material-dashboard --name=my-dashboard`

### Material Data Table

You can generate a starter data table component that is pre-configured with a datasource for sorting and pagination.

Run: `ng generate @angular/material:material-table --name=my-table`

## Development server

`npm run dev`: [concurrently](https://github.com/kimmobrunfeldt/concurrently) execute MongoDB, Angular build, TypeScript compiler and Express server.

A window will automatically open at [localhost:4200](http://localhost:4200). Angular and Express files are being watched. Any change automatically creates a new bundle, restart Express server and reload your browser.


Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Production mode
`npm run prod`: run the project with a production bundle and AOT compilation listening at [localhost:3000](http://localhost:3000) 

Run `ng build--prod` flag for a production build. The build artifacts will be stored in the `dist/` directory. 

## Deploy (Heroku)
1. Go to Heroku and create a new app (eg: `your-app-name`)
2. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)
3. `heroku login`
4. `mkdir your-app-name && cd your-app-name`
5. `git init`
6. `heroku git:remote -a your-app-name`
7. Download this repo and copy all files into `your-app-name` folder
8. `npm i`
9. Edit `package.json` as following:
   - add this line to scripts: `"postinstall": "tsc -p srv && ng build --prod"`
   - move the following packages from devDependencies to dependencies: `@angular/cli`, `@angular/compiler-cli`, `@types/jasmine`, `@types/node`, `chai`, `chai-http` and `typescript`.
10. Edit `.env` and replace the MongoDB URI with a real remote MongoDB server. You can create a MongoDB server with Heroku or mLab.
11. `git add .`
12. `git commit -am "Make it beter"`
13. `git push heroku master`
14. `heroku open` and a window will open with your app online

## Library Support
One of the most requested features for our CLI has been support for creating and building libraries, and we are proud to introduce:

`ng generate library <name>`

## Tree Shakable Providers
To make your applications smaller, we’ve moved from modules referencing services to services referencing modules. This allows us to only bundle services into your code base in modules where they are injected.

### Before

```
@NgModule({
  ...
  providers: [MyService]
})
export class AppModule {}
```

```
import { Injectable } from '@angular/core';

@Injectable()
export class MyService {
  constructor() { }
}
```

After

No references are needed in our NgModule.

```
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyService {
  constructor() { }
}
```

## Animations Performance Improvements
We’ve updated our implementation of Animations to no longer need the web animations polyfill. This means that you can remove this polyfill from your application and save approximately 47KB of bundle size, while increasing animations performance in Safari at the same time.

### RxJS v6
Angular has been updated to use v6 of RxJS. RxJS is an independent project that released v6 several weeks ago. RxJS v6 brings with it several major changes, along with a backwards compatibility package rxjs-compat that will keep your applications working.

RxJS has been rearranged to make it more tree-shakable, ensuring that only the pieces of RxJS that you use are included in your production bundles.

If you use ng update, your application should keep working, but you can learn more about 7.0 migration.

## Long Term Support (LTS)
We are expanding our Long Term Support to all major releases.

Each major release will be supported for 18 months with around 6 months of active development followed by 12 months of critical bugfixes and security patches.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
