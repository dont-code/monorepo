![image](https://dont-code.net/assets/logo-shadow-squared.png)
## What is it for ?

This repository contains all the [dont-code](https://dont-code.net) no-code / low-code platform enabling you to quickly produce your very own application.

## What is it ?
It's various subprojects provides an "non-developer" builder, an application previewer, typescript libraries for plugin developments, and several plugins.
It gets the application schema from the core library (extended by plugins), and dynamically generates a form with questions.
![Screenshot](https://dont-code.net/assets/Builder%20define%20Task%20Application.png)

## How is it working ?
Dont-code platform relies on [Angular](https://angular.dev) & [PrimeNg](https://primeng.org)
Please see the [Developer's page](https://dont-code.net/developers.html) to understand how it is being done.

## How to build it ?
This project contains multiple sub-projects, all linked together using [Rush](https://rushjs.io/), [pNPM](https://pnpm.io/).
Each subproject is then build using [Nx](https://nx.dev)

1. Installing

  `npm install nx @microsoft/rush -g` Will install rush & nx.dev globally

  `rush update`

4. Running

You can run the builder with:
    `cd apps/ide-ui; nx ide-ui:serve:online`

and point your browser to https://localhost:4200

3. Running tests

  `rush test` will execute all unit tests using [Jest](https://jestjs.io)

4. Running End to end tests

   `rush e2e-test` will execute all End 2 end test under [Cypress](https://cypress.io)

  
## Thank you
