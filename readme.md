# Drial
Simple test automation in the browser completely from the perspective of an end user clicking and typing things.  No third party madness and no additional APIs to learn.

## License
[AGPLv3](LICENSE)
Much of this project's code is ripped straight from [Share File Systems](https://github.com/prettydiff/share-file-systems) which is also licensed AGPLv3.

## Installation

* Requires Node.js and git

1. get the code
  1. `git clone https://github.com/prettydiff/drial.git` - get it from github
  1. `npm install drial` - get it from npm
1. move into the project directory
  1. if cloned from git - `cd drial`
  1. if downloaded from npm - `cd node_modules/drial`
1. `npm install -g typescript` - install the compiler
1. `npm install` - install local dependencies required by the compiler
1. `tsc` - compile the code
1. `node js/application build` - build the application

## Run it
* `drial websites campaign:demo`
* For more options try the interactive command documentation `drial commands websites`.
* See the [documentation](documentation) for things like additional command guidance, browser research, known problems, how to write tests, and how this application works.

## Getting started
1. Execute `drial commands` to see commands available in the terminal and execute it with a command name for all supported options with examples: `drial commands websites`.
2. Skim the [documentation](/documentation).

## Configuration
This application stores all configurations in the file `/lib/utilities/configuration.ts`.

### Campaign path
The application requires a campaign file to know which instructions to execute.  The default location for campaign files is `/campaigns` of this application.  To specify a different location open the configuration file and modify the value of `campaignPath` property with an absolute file system path.  Once complete rebuild with the command: `drial build`.

### Browser path
The default installation paths for several popular browsers per operating system are listed in the configuration file.

* If your browser's default installation path for your operating system is absent please open a Github issue with the file system path and I will update the application.
* If you are using a custom installation path and need to change the configuration file then make your change and run the command `drial build` to compile the code.

## Campaign Files
Please read the documentation files on client side tests: [/documentation/website_tests.md](/documentation/website_tests.md).

## Timing
Aside from the listed examples and test specified delays all test instructions attempt to execute as fast as the machine will allow.

* The application starts with a 2 second delay to provide enough time for the browser to open before sending it test instructions.  This delay can be customized.  See `drial commands websites` for an example.
* The application waits for a page to fully load before sending test instructions.  This is the factor that slows down this application the most.  If testing appears slow examine the performance of the page, such as if its waiting on third party scripts to request additional artifacts.