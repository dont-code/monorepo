![image](https://dont-code.net/assets/logo-shadow-squared.png)
## What is it for ?

This plugin for the [Dont-code](https://dont-code.net) platform enables loading entity data from any rest service.

## What is it ?
It is a standard plugin (with no display component), based on the [Seed project](https://github.com/dont-code/plugin-seed)
1. A Nx monorepo with the library [rest](libs/rest) containing the two plugins.
2. An Application [plugin-tester](apps/plugin-tester) loading the plugin automatically and allowing you to test and debug it.
3. Unit tests setup with Jest.
4. End 2 end tests example [plugin-tester-e2e](apps/plugin-tester-e2e) using Cypress.
5. Github Action scripts to build and deploy the plugins automatically [Workflows](.github/workflows).

## How to use it ?

If you want to use it in the Builder:
- Starts the Builder, and click on "Previewer" button to initiate a session with the Previewer.
- Describe the entity fields in the Builder design page
- Adds a new Source (at the bottom of the page), sets a name, sets its type as 'Rest' and set the url of the rest service to call in 'url' field. 
- In the entity field, sets its source field to the name you just added.
- You should see the entity data being displayed in the  Previewer 

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
`yalc add @dontcode/plugin-rest` to install the plugin using Yalc

You can now set breakpoints in your plugin classes running in the builder, and if you modify your plugin code, just run
`npm run publish-all` again to rebuild it and reload in the builder application.


## Thank you

This project was generated using [Nx](https://nx.dev), visit the [Nx Documentation](https://nx.dev/angular) to learn more.
