![image](https://dont-code.net/assets/logo-shadow-squared.png)
## What is it for ? 

This application allows you to see in realtime the effect of the changes you are doing with the dont-code editor.
It is part of the [Dont-code](https://dont-code.net) no-code / low-code platform enabling you to quickly produce your very own application. 

## What is it ?
It's an Angular application that listens to changes sent by the editor application and updates or pushes changes to plugins
![Screenshot](https://dont-code.net/assets/Previewer%20Edit%20Task.png)

## How is it working ?

## How to build it ?
This project is a standard Angular - npm project, so the usual commands apply:

1. Installing

`npm install nx -g` Install nx.dev globally

`npm install`

4. Running

  `nx run preview-ui:server:online`

and point your browser to https://localhost:4201

3. Running unit tests

  `nx run preview-ui:test`

4. Running Cypress End to end tests

   `nx run preview-ui-e2e:e2e`

6. Debugging your plugin in the Builder itself
   We have setup some commands to enable debugging the plugin when run inside the Builder.
   Using npm link is difficult and doesn't work all the time, so we use [Yalc](https://github.com/wclr/yalc).

`npm install yalc -g` Installs the Yalc tool globally

`npm run publish-all` in the dist/libs/XXX directory of your plugin to publish it to Yalc repository, after version increase (to bypass Angular caching)

Then in this project (ide-ui) :
`npm run yalc-add-all` to install all the common plugins and libraries

and

`yalc add @dontcode/plugin-xxxx` to install your plugin using Yalc

You can now set breakpoints in your plugin classes running in the builder, and if you modify your plugin code, just run
`npm run publish-all` again to rebuild it and reload in the builder application.

7. Committing
   If you are using yalc as described above, it modifies the package.json to point to the yalc repository, like this:
   ```
   "@dontcode/core": "file:.yalc/@dontcode/core",
   "@dontcode/plugin-basic": "file:.yalc/@dontcode/sandbox",
   "@dontcode/plugin-common": "file:.yalc/@dontcode/plugin-common",
   ```

Before publishing, you need to revert package.json to the standard npm import, you can do it easily with some yalc commands:
```
$> yalc retreat --all
Retreating package @dontcode/core version ==> ^0.5.2
Retreating package @dontcode/plugin-common version ==> ^0.5.2
Retreating package @dontcode/sandbox version ==> ^0.5.2

$> git commit ....
....

$> yalc restore --all
Restoring package `@dontcode/core` from .yalc directory
Restoring package `@dontcode/plugin-common` from .yalc directory
Restoring package `@dontcode/sandbox` from .yalc directory
Package @dontcode/plugin-common@0.5.6-3 added ==> /home/gc-garunda/devs/dont-code/github/ide-ui/node_modules/@dontcode/plugin-common
Package @dontcode/sandbox@0.5.6-2 added ==> /home/gc-garunda/devs/dont-code/github/ide-ui/node_modules/@dontcode/plugin-basic
Package @dontcode/core@0.5.3-5 added ==> /home/gc-garunda/devs/dont-code/github/ide-ui/node_modules/@dontcode/core

```

## Thank you

This project was generated using [Nx](https://nx.dev), visit the [Nx Documentation](https://nx.dev/angular) to learn more.
