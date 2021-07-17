
/* lib/terminal/utilities/commands_documentation - A data structure defining command documentation with usage examples. */
import vars from "./vars.js";

const commands_documentation = function terminal_utility_commandsDocumentation(command:string):commandDocumentation {
    return {
        build: {
            description: "Rebuilds the application.",
            example: [
                {
                    code: `${command}build`,
                    defined: "Compiles from TypeScript into JavaScript and puts libraries together."
                },
                {
                    code: `${command}build incremental`,
                    defined: "Use the TypeScript incremental build, which takes about half the time."
                },
                {
                    code: `${command}build local`,
                    defined: "The default behavior assumes TypeScript is installed globally. Use the 'local' argument if TypeScript is locally installed in node_modules."
                }
            ]
        },
        commands: {
            description: "List all supported commands to the console or examples of a specific command.",
            example: [
                {
                    code: `${command}commands`,
                    defined: "Lists all commands and their definitions to the shell."
                },
                {
                    code: `${command}commands directory`,
                    defined: "Details the mentioned command with examples, which in this case is the 'directory' command."
                },
                {
                    code: `${command}commands all`,
                    defined: "Specifying 'all' will output verbose documentation and code examples for all supported commands."
                }
            ]
        },
        copy: {
            description: "Copy files or directories from one location to another on the local file system.",
            example: [
                {
                    code: `${command}copy source/file/or/directory destination/path`,
                    defined: "Copies the file system artifact at the first address to the second address."
                },
                {
                    code: `${command}copy "C:\\Program Files" destination\\path`,
                    defined: "Quote values that contain non-alphanumeric characters."
                },
                {
                    code: `${command}copy source destination ignore [build, .git, node_modules]`,
                    defined: "Exclusions are permitted as a comma separated list in square brackets following the ignore keyword."
                },
                {
                    code: `${command}copy source destination ignore[build, .git, node_modules]`,
                    defined: "A space between the 'ignore' keyword and the opening square brace is optional."
                },
                {
                    code: `${command}copy ../sparser ../sparserXX ignore [build, .git, node_modules]`,
                    defined: "Exclusions are relative to the source directory."
                }
            ]
        },
        directory: {
            description: "Traverses a directory in the local file system and generates a list.  If a source is not provided the current working directory is used.",
            example: [
                {
                    code: `${command}directory source:"my/directory/path"`,
                    defined: "Returns an array where each index is an array of [absolute path, type, parent index, file count, stat]. Type can refer to 'file', 'directory', or 'link' for symbolic links.  The parent index identify which index in the array is the objects containing directory and the file count is the number of objects a directory type object contains."
                },
                {
                    code: `${command}directory source:"my/directory/path" depth:9`,
                    defined: "The depth of child directories to traverse. The default value of 0 applies full recursion."
                },
                {
                    code: `${command}directory source:"my/directory/path" symbolic`,
                    defined: "Identifies symbolic links instead of the object the links point to"
                },
                {
                    code: `${command}directory source:"my/directory/path" ignore [.git, node_modules, "program files"]`,
                    defined: "Sets an exclusion list of things to ignore."
                },
                {
                    code: `${command}directory source:"my/path" typeof`,
                    defined: "Returns a string describing the artifact type."
                },
                {
                    code: `${command}directory source:"my/directory/path" mode:"array"`,
                    defined: "Returns an array of strings where each index is an absolute path."
                },
                {
                    code: `${command}directory source:"my/path" mode:"hash"`,
                    defined: "Includes a SHA512 hash in the output for each file system object of type 'file'."
                },
                {
                    code: `${command}directory source:"my/directory/path" mode:"list"`,
                    defined: "Writes a list of file system artifacts, one per line, to the shell."
                },
                {
                    code: `${command}directory source:"my/directory/path" search:"any string"`,
                    defined: "Returns results in the default format, but only containing artifacts containing the search token. If the 'search' argument is not provided the search function will not be applied."
                },
                {
                    code: `${command}directory source:"my/directory/path" relative`,
                    defined: "The relative argument provide relative paths from the source path instead of absolute paths."
                }
            ]
        },
        get: {
            description: "Retrieve a resource via an absolute URI.",
            example: [
                {
                    code: `${command}get http://example.com/file.txt`,
                    defined: "Gets a resource from the web and prints the output to the shell."
                },
                {
                    code: `${command}get http://example.com/file.txt path/to/file`,
                    defined: "Get a resource from the web and writes the resource as UTF8 to a file at the specified path."
                }
            ]
        },
        hash: {
            description: "Generate a SHA512 hash of a file or a string.",
            example: [
                {
                    code: `${command}hash path/to/file`,
                    defined: "Prints a SHA512 hash to the shell for the specified file's contents in the local file system."
                },
                {
                    code: `${command}hash verbose path/to/file`,
                    defined: "Prints the hash with file path and version data."
                },
                {
                    code: `${command}hash string "I love kittens."`,
                    defined: "Hash an arbitrary string directly from shell input."
                },
                {
                    code: `${command}hash https://prettydiff.com/`,
                    defined: "Hash a resource from the web."
                },
                {
                    code: `${command}hash path/to/directory`,
                    defined: "Directory hash recursively gathers all descendant artifacts and hashes the contents of each of those items that are files, hashes the paths of directories, sorts this list, and then hashes the list of hashes."
                },
                {
                    code: `${command}hash path/to/directory list`,
                    defined: "Returns a JSON string of an object where each file, in absolutely path, is a key name and its hash is the key's value."
                },
                {
                    code: `${command}hash file/system/path algorithm:sha3-512`,
                    defined: "The algorithm argument allows a choice of hashing algorithm. Supported values: 'blake2d512', 'blake2s256', 'sha3-224', 'sha3-256', 'sha3-384', 'sha3-512', 'sha384', 'sha512', 'sha512-224', 'sha512-256', 'shake128', 'shake256'"
                }
            ]
        },
        lint: {
            description: "Use ESLint against all JavaScript files in a specified directory tree.",
            example: [
                {
                    code: `${command}lint ../tools`,
                    defined: "Lints all the JavaScript files in that location and in its subdirectories."
                },
                {
                    code: `${command}lint`,
                    defined: `Specifying no location defaults to the ${vars.name} application directory.`
                },
                {
                    code: `${command}lint ../tools ignore [node_modules, .git, test, units]`,
                    defined: "An ignore list is also accepted if there is a list wrapped in square braces following the word 'ignore'."
                }
            ]
        },
        mkdir: {
            description: "Recursively creates a directory structure.  For example if 'my/new/path` were to be created but parent 'my' doesn't exist this command will create all three directories, but it will not alter or overwrite any artifacts already present. Relative paths are relative to the terminal's current working directory.",
            example: [{
                code: `${command}mkdir my/path/to/create`,
                defined: "This example would create directories as necessary to ensure the directory structure 'my/path/to/create' is available from the location relative to the terminal's current working directory."
            }]
        },
        remove: {
            description: "Remove a file or directory tree from the local file system.",
            example: [
                {
                    code: `${command}remove path/to/resource`,
                    defined: "Removes the specified resource."
                },
                {
                    code: `${command}remove "C:\\Program Files"`,
                    defined: "Quote the path if it contains non-alphanumeric characters."
                }
            ]
        },
        service: {
            description: "Launches a HTTP service and web sockets so that the web tool is automatically refreshed once code changes in the local file system.",
            example: [
                {
                    code: `${command}service`,
                    defined: `Launches the service on default port ${vars.port_default.secure} (${vars.port_default.insecure} insecure) and web sockets on port ${vars.port_default.secure + 1} (${vars.port_default.insecure + 1} insecure).`
                },
                {
                    code: `${command}service 8080`,
                    defined: "If a numeric argument is supplied the web service starts on the port specified and web sockets on the following port."
                },
                {
                    code: `${command}service 0`,
                    defined: "To receive a random available port specify port number 0."
                },
                {
                    code: `${command}service browser`,
                    defined: "The 'browser' argument launches the default location in the user's default web browser."
                },
                {
                    code: `${command}service test`,
                    defined: "The 'test' argument tells the service to use data from a separate settings location for running tests instead of the user's actual data."
                },
                {
                    code: `${command}service test browser 9000`,
                    defined: "An example with all supported arguments.  The supported arguments may occur in any order, but the third argument (after 'browser' and 'test') must be a number."
                },
                {
                    code: `${command}service ip:192.168.1.125`,
                    defined: "An argument that begins with 'ip:' forces use of the specified IP address."
                },
                {
                    code: `${command}service secure`,
                    defined: "The 'secure' argument forces the service to use secure protocols: HTTPS and WSS."
                },
                {
                    code: `${command}service insecure`,
                    defined: "The 'insecure' argument forces the service to use insecure protocols: HTTP and WS."
                }
            ]
        },
        test: {
            description: "Builds the application and then runs all the test commands",
            example: [
                {
                    code: `${command}test campaign:demo`,
                    defined: "Executes tests in the provided campaign name.  The campaign value matches the name of a file in the campaigns directory without file extension."
                },
                {
                    code: `${command}test campaign:demo browser:firefox port:9000`,
                    defined: "Optionally the port and/or browser can be specified. The browser and port are indicated in the test campaign, but these values will override the values indicated in the campaign file."
                },
                {
                    code: `${command}test campaign:demo delay:2000`,
                    defined: "Optionally the delay can be specified with a value in milliseconds.  The default value is 5000 (5 seconds).  This is the delay between application launch, and thus browser window launch, and the firing of test instructions.  If the delay is too short the application will output an error because the browser won't be ready to receive tests.  If the delay is too long you are wasting your precious time."
                },
                {
                    code: `${command}test campaign:demo noClose`,
                    defined: "The default behavior is to terminate the application and close the browser upon test completion. The optional 'noClose' argument keeps everything open and alive for debugging and experimentation purposes."
                }
            ]
        },
        update: {
            description: "Pulls code from the git repository of the current git remote and branch, rebuilds the application, then executes a command. The child command will always execute from the project's absolute directory.",
            example: [
                {
                    code: `${command}update`,
                    defined: `If no additional arguments are provided the child command to execute will be: ${command}service`
                },
                {
                    code: `${command}update test_browser`,
                    defined: `The child command will be: ${command}test_browser`
                },
                {
                    code: `${command}update lint ../tools ignore [node_modules, .git, test, units]`,
                    defined: `All arguments are passed into the child command equivalent to: ${command}lint ../tools ignore [node_modules, .git, test, units]`
                }
            ]
        },
        version: {
            description: "Prints the current version number and date of prior modification to the console.",
            example: [{
                code: `${command}version`,
                defined: "Prints the current version number and date to the shell."
            }]
        }
    };
};

export default commands_documentation;