# Drial
Simple test automation in the browser for people familiar with JavaScript.  No third party madness and no additional APIs to learn.

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

* `drial websites browser:chrome`
* For more options try the documentation `drial commands websites`
* See the documentation for things like additional command guidance, browser research, how this application works.