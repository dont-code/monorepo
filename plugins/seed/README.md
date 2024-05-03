![image](https://dont-code.net/assets/logo-shadow-squared.png)
## What is it for ?

This project allows developers to quickstart their development of a Plugin for the  [Dont-code](https://dont-code.net) no-code / low-code platform.
It provides example for two kinds of plugins:
- Seed Field adds a new type of field to the platform.
- Seeded Entity shows how to modify the Dont-code model and manage the updated display.

## What is it ?
It contains a simple but complete repository you can fork to start your development. That includes:
1. A Nx monorepo with a library [seed](libs/seed) containing the two plugins.
2. An Application [plugin-tester](apps/plugin-tester) loading these plugins automatically and allowing you to test and debug them.
3. Unit tests setup with Jest for each of these plugins.
4. End 2 end tests example [plugin-tester-e2e](apps/plugin-tester-e2e) using Cypress.
5. Github Action scripts to build and deploy the plugins automatically [Workflows](.github/workflows).

## How to use it ?

To develop your own plugins using this seed repository, simply:
1. Fork this repository in github.
2. Install it, run some tests and the tester application to make sure it is working.
3. If you want to create a plugin for a new Field, rename and modify the [SeedField component](libs/seed/src/lib/preview/seed-field).
4. If you want to create any other plugin types, rename and modify the [SeedEntity component](libs/seed/src/lib/preview/seeded-entity).
5. Updates the configuration to be injected to the Dont-code platform here [SeedPlugin](libs/seed/src/lib/declaration/seed-plugin.ts)
6. Ensure the plugin tester adds the updated module name of your plugin [AppModule](apps/plugin-tester/src/app/app.module.ts)
7. Modify the templates loaded by the plugin tester to ease usage of your plugin [templates.json](apps/plugin-tester/src/assets/dev/templates.json)
8. Run the plugin-tester application and debug your plugins there
9. Modify and enhance the end 2 end tests of your plugins [seed.spec.ts](apps/plugin-tester-e2e/src/integration/seed.spec.ts)
10. Modify the Github Action scripts [to build](.github/workflows/dev-build.yml), [and deploy](./.github/workflows/main-build.yml) your plugins
11. Test in the Dont-code Buidler and Previewer applications

## How to build it ?
This project is a standard Angular - npm project, so the usual commands apply:

1. Installing

`npm install nx -g` #Install nx.dev globally

`npm install`

3. Running the tester application

`nx run plugin-tester:serve`

and point your browser to http://localhost:4200

3. Running unit tests

  `nx run seed:test`

4. Running Cypress End to end tests

  `nx run plugin-tester-e2e:e2e`

5. Build and deploy

  Just commit to Development or Release branch, the Github actions scripts will take care of it

6. Debugging in Builder or Previewer application
  We have setup some commands to enable debugging the plugin when run inside the Ide or Previewer.
  Using npm link is difficult and doesn't work all the time, so we use [Yalc](https://github.com/wclr/yalc).

  `npm install yalc -g` Installs the Yalc tool globally

  `npm run publish-all` Publish the library in Yalc repository, after version increase (to bypass Angular caching)
  
  Then in the builder project (ide-ui) :
  `yalc add @dontcode/plugin-seed` to install the plugin using Yalc

  You can now set breakpoints in your plugin classes running in the builder, and if you modify your plugin code, just run
  `npm run publish-all` again to rebuild it and reload in the builder application.


## Thank you

This project was generated using [Nx](https://nx.dev), visit the [Nx Documentation](https://nx.dev/angular) to learn more.
