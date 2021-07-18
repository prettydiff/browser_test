
<!-- documentation/configuration - How to use and modify this application. -->

# drial - Configuration

## User configuration settings
This configurations are found in file `/lib/utilities/configuration.ts`.  The configurations specify:
* The names of supported browsers.  If you have a browser installed that is not named in that file this application will error when attempting to execute it.
* The flags required to launch a browser for testing.  These flags are tested and known to work.
* The location of test campaign files.  Please keep in mind this application is written in TypeScript language, but campaign files must be JavaScript files as they are only imported dynamically at run time, so this value must indicate where to find JavaScript campaign files on the local file system.  The default value is `/campaigns` of this project.

## Internal application configurations
Internal configurations are stored in file: `/lib/configurations.json`.  Please note that this file is dynamically written and all other configuration assets, such as .gitignore and .eslintrc.json, are generated from this file.

## Commands and their options
Please see [commands.md](commands.md).

## Modifying code
After code is modified it must be rebuilt: `drial build`.  If the `/lib/terminal/commands/build.ts` file is modified the build command must be run twice.

## Linting code
If ESLint is not already installed use: `npm install -g eslint`.

To lint the code execute: `drial lint`.  See the documentation for more details: `drial commands lint`.