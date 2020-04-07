# Retrospective tool

This is a small retrospective web applications tool using [webpack](https://webpack.js.org/), [handlebars](http://handlebarsjs.com/), [UIkit](https://getuikit.com/) and [scss](https://sass-lang.com/) along with [babel](https://babeljs.io/)

## Dependencies

This project relies on having [nodejs with npm](https://nodejs.org) and [git](https://git-scm.com/) installed.

## Install

In the node command prompt navigate to a folder you want to clone the repo into. 

1. download the repo into a folder

    ```git clone <prefered repo link> <optional repo name>```

2. move into the repository folder

    ```cd <repo name>/app```  

3. install the dependencies 

    ```npm install```

## Build

This project contains two webpack.[].config.js webpack configurations.

### Developement
> webpack.dev.config

Build the developement version

```npm run start```
 
Please folow [localhost:9000](localhost:9000)

### Production
> webpack.prod.config

Build the production version

```npm run build```

Find bundle files in dist folder

