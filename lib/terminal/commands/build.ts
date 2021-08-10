/* lib/terminal/commands/build - The library that executes the build and test tasks. */
import { exec } from "child_process";
import { readFile, stat, Stats, symlink, writeFile } from "fs";
import { EOL } from "os";
import { resolve } from "path";

import commands_documentation from "../utilities/commands_documentation.js";
import error from "../utilities/error.js";
import directory from "./directory.js";
import humanTime from "../utilities/humanTime.js";
import lint from "./lint.js";
import log from "../utilities/log.js";
import makeDir from "./makeDir.js";
import vars from "../utilities/vars.js";
import remove from "./remove.js";

// build/test system
const build = function terminal_commands_build(test:boolean, callback:() => void):void {
        let firstOrder:boolean = true,
            sectionTime:[number, number] = [0, 0],
            commandName:string;
        const order = {
                build: [
                    "configurations",
                    "commands",
                    "libReadme",
                    "typescript",
                    "version",
                    "shellGlobal"
                ],
                test: [
                    "lint"
                ]
            },
            type:"build"|"test" = (test === true)
                ? "test"
                : "build",
            orderLength:number = order[type].length,
            testsCallback = function terminal_commands_build_testsCallback(message:string, failCount:number):void {
                if (failCount > 0) {
                    vars.verbose = true;
                    log([message], true);
                    process.exit(1);
                } else {
                    next(message);
                }
            },
            // a short title for each build/test phase
            heading = function terminal_commands_build_heading(message:string):void {
                if (firstOrder === true) {
                    log([""]);
                    firstOrder = false;
                } else if (order[type].length < orderLength) {
                    log(["________________________________________________________________________", "", ""]);
                }
                log([vars.text.cyan + vars.text.bold + message + vars.text.none, ""]);
            },
            // indicates how long each phase took
            sectionTimer = function terminal_commands_build_sectionTime(input:string):void {
                let now:string[] = input.replace(`${vars.text.cyan}[`, "").replace(`]${vars.text.none} `, "").split(":"),
                    numb:[number, number] = [(Number(now[0]) * 3600) + (Number(now[1]) * 60) + Number(now[2].split(".")[0]), Number(now[2].split(".")[1])],
                    difference:[number, number],
                    times:string[] = [],
                    time:number = 0,
                    str:string = "";
                difference = [numb[0] - sectionTime[0], (numb[1] + 1000000000) - (sectionTime[1] + 1000000000)];
                sectionTime = numb;
                if (difference[1] < 0) {
                    difference[0] = difference[0] - 1;
                    difference[1] = difference[1] + 1000000000;
                }
                if (difference[0] < 3600) {
                    times.push("00");
                } else {
                    time = Math.floor(difference[0] / 3600);
                    difference[0] = difference[0] - (time * 3600);
                    if (time < 10) {
                        times.push(`0${time}`);
                    } else {
                        times.push(String(time));
                    }
                }
                if (difference[0] < 60) {
                    times.push("00");
                } else {
                    time = Math.floor(difference[0] / 60);
                    difference[0] = difference[0] - (time * 60);
                    if (time < 10) {
                        times.push(`0${time}`);
                    } else {
                        times.push(String(time));
                    }
                }
                if (difference[0] < 1) {
                    times.push("00");
                } else if (difference[0] < 10) {
                    times.push(`0${difference[0]}`);
                } else {
                    times.push(String(difference[0]));
                }
                str = String(difference[1]);
                if (str.length < 9) {
                    do {
                        str = `0${str}`;
                    } while (str.length < 9);
                }
                times[2] = `${times[2]}.${str}`;
                log([`${vars.text.cyan + vars.text.bold}[${times.join(":")}]${vars.text.none} ${vars.text.green}Total section time.${vars.text.none}`]);
            },
            // the transition to the next phase or completion
            next = function terminal_commands_build_next(message:string):void {
                let phase:buildPhase = order[type][0] as buildPhase,
                    time:string = humanTime(false);
                if (message !== "") {
                    log([time + message]);
                    sectionTimer(time);
                }
                if (order[type].length < 1) {
                    if (vars.command === "build") {
                        vars.verbose = true;
                        heading(`${vars.text.none}All ${vars.text.green + vars.text.bold}build${vars.text.none} tasks complete... Exiting clean!\u0007`);
                        log([""], true);
                        process.exit(0);
                        return;
                    }
                    callback();
                } else {
                    order[type].splice(0, 1);
                    phases[phase]();
                }
            },
            // These are all the parts of the execution cycle, but their order is dictated by the 'order' object.
            phases:buildPhaseList = {
                commands: function terminal_commands_build_commands():void {
                    heading("Writing commands.md documentation");

                    const docs:commandDocumentation = commands_documentation(vars.command_instruction),
                        keys:string[] = Object.keys(docs),
                        output:string[] = [],
                        eachExample = function terminal_commands_build_commands_eachExample(example:commandExample):void {
                            output.push(`1. \`${example.code}\``);
                            output.push(`   - ${example.defined}`);
                        },
                        filePath:string = `${vars.projectPath}documentation${vars.sep}commands.md`;
                    output.push("");
                    output.push("<!-- documentation/commands - This documentation describes the various supported terminal commands and is automatically generated from `lib/terminal/utilities/commands_documentation.ts`. -->");
                    output.push("");
                    output.push(`# ${vars.name} - Command Documentation`);
                    output.push(`This documentation is also available interactively at your finger tips using the command: \`${vars.command_instruction}commands\`.  **Please do not edit this file as it is written by the build process.**`);
                    output.push("");
                    keys.forEach(function terminal_commands_build_commands_each(command:string):void {
                        const examples:commandExample[] = docs[command as commands].example;
                        output.push(`## ${command}`);
                        output.push(docs[command as commands].description);
                        output.push("");
                        output.push("### Examples");
                        examples.forEach(eachExample);
                        output.push("");
                    });
                    writeFile(filePath, output.join("\n"), "utf8", function terminal_commands_build_commands_write(err:Error):void {
                        if (err === null) {
                            next(`File ${filePath} successfully written.`);
                            return;
                        }
                        error([err.toString()]);
                    });
                },
                // writes configuration data to files
                configurations: function terminal_commands_build_configurations():void {
                    heading("Write Configuration Files");
                    readFile(`${vars.projectPath}lib${vars.sep}configurations.json`, "utf8", function terminal_commands_build_configurations_readFile(err:Error, fileData:string) {
                        if (err === null) {
                            const config:unknown = JSON.parse(fileData),
                                keys:string[] = Object.keys(config),
                                length:number = keys.length,
                                writeCallback = function terminal_commands_build_configurations_read_remove(wErr:Error):void {
                                    if (wErr === null) {
                                        a = a + 1;
                                        if (a === length) {
                                            next("Configuration files written!");
                                        } else {
                                            write();
                                        }
                                        return;
                                    }
                                    error([wErr.toString()]);
                                },
                                write = function terminal_commands_build_configurations_readFile_remove():void {
                                    // @ts-ignore - the configuration.json file is a storehouse of settings data to remove clutter from the project root
                                    if (Array.isArray(config[keys[a]]) === true) {
                                        // @ts-ignore - the configuration.json file is a storehouse of settings data to remove clutter from the project root
                                        if (config[keys[a]].length === 1) {
                                            // @ts-ignore - the configuration.json file is a storehouse of settings data to remove clutter from the project root
                                            config[keys[a]] = config[keys[a]][0];
                                        } else {
                                            // @ts-ignore - the configuration.json file is a storehouse of settings data to remove clutter from the project root
                                            config[keys[a]] = config[keys[a]].join(EOL);
                                        }
                                    } else {
                                        // @ts-ignore - the configuration.json file is a storehouse of settings data to remove clutter from the project root
                                        config[keys[a]] = JSON.stringify(config[keys[a]]);
                                    }
                                    // @ts-ignore - the configuration.json file is a storehouse of settings data to remove clutter from the project root
                                    writeFile(vars.projectPath + keys[a], config[keys[a]], "utf8", writeCallback);
                                },
                                removeCallback = function terminal_commands_build_configurations_readFile_remove():void {
                                    count = count + 1;
                                    if (count === length) {
                                        a = 0;
                                        write();
                                    }
                                };
                            let a:number = length,
                                count:number = 0;
                            do {
                                a = a - 1;
                                remove(vars.projectPath + keys[a], removeCallback);
                            } while (a > 0);
                            return;
                        }
                        error([err.toString()]);
                    });
                },
                // libReadme builds out the readme file that indexes code files in the current directory
                libReadme: function terminal_commands_build_libReadme():void {
                    heading("Writing lib directory readme.md files.");

                    let dirList:directoryList = [];
                    const callback = function terminal_commands_build_dirCallback(list:directoryList):void {
                            if (dirList.length < 1) {
                                dirList = list;
                            } else {
                                dirList = dirList.concat(list);
                                dirs();
                            }
                        },
                        dirs = function terminal_commands_build_libReadme_dirs():void {
                            let writeStart:number = 0,
                                writeEnd:number = 0,
                                master:number = 0,
                                a:number = 0,
                                codeLength:number = 0;
                            const length:number = dirList.length,
                                masterList = function terminal_commands_build_libReadme_masterList():void {
                                    let a:number = 0,
                                        b:number = 0,
                                        path:string,
                                        extension:"md"|"ts";
                                    const fileLength:number = files.length,
                                        fileContents:string[] = [],
                                        filePath:string = `${vars.projectPath}documentation${vars.sep}library_list.md`;
                                    fileContents.push("<!-- documentation/library_list - Automated list of all code and documentation files with brief descriptions. -->");
                                    fileContents.push("");
                                    fileContents.push(`# ${vars.name} - Code Library List`);
                                    fileContents.push("This is a dynamically compiled list of supporting code files that comprise this application with a brief description of each file.");
                                    fileContents.push("");
                                    do {
                                        if (a < 1 || files[a].path !== files[a - 1].path) {
                                            path = `* Directory *[../${files[a].path}](../${files[a].path})*`;
                                            fileContents.push(path);
                                        }
                                        b = files[a].path.length + files[a].name.length;
                                        if (files[a].path === "documentation") {
                                            extension = "md";
                                            path = `   - **[${files[a].name}.${extension}](${files[a].name}.${extension})**`;
                                            b = b - 17;
                                        } else {
                                            extension = "ts";
                                            path = `   - **[../${files[a].path}/${files[a].name}.${extension}](../${files[a].path}/${files[a].name}.${extension})**`;
                                        }
                                        if (b < master) {
                                            do {
                                                path = `${path}  `;
                                                b = b + 1;
                                            } while (b < master);
                                        }
                                        fileContents.push(`${path} - ${files[a].description}`);
                                        a = a + 1;
                                    } while (a < fileLength);
                                    writeFile(filePath, fileContents.join("\n"), "utf8", function terminal_commands_build_libReadme_masterList_write(erWrite:Error):void {
                                        if (erWrite !== null) {
                                            error([erWrite.toString()]);
                                            return;
                                        }
                                        log([`${humanTime(false)}Updated ${filePath}`]);
                                        next("Completed writing lib directory readme.md files.");
                                    });
                                },
                                write = function terminal_commands_build_libReadme_write(path:string, fileList:string):void {
                                    const filePath:string = `${vars.projectPath + path.replace(/\//g, vars.sep) + vars.sep}readme.md`;
                                    writeStart = writeStart + 1;
                                    readFile(filePath, function terminal_commands_build_libReadme_write_readFile(erRead:Error, readmeFile:Buffer):void {
                                        if (erRead !== null) {
                                            error([
                                                "Error reading file during documentation build task.",
                                                `File: ${filePath}`
                                            ]);
                                            return;
                                        }
                                        const sample:string = "Contents dynamically populated. -->",
                                            index:number = readmeFile.toString().indexOf(sample) + sample.length,
                                            readme:string = readmeFile.toString().slice(0, index) + `\n\n${fileList}`;
                                        // Sixth, write the documentation to each respective file
                                        writeFile(filePath, readme, "utf8", function terminal_commands_build_libReadme_write_readFile_writeFile(erWrite:Error):void {
                                            if (erWrite !== null) {
                                                error([
                                                    "Error writing file during documentation build task.",
                                                    `File: ${filePath}`
                                                ]);
                                                return;
                                            }
                                            log([`${humanTime(false)}Updated ${filePath}`]);
                                            writeEnd = writeEnd + 1;
                                            if (writeEnd === writeStart) {
                                                // Finally, once all the readme.md files are written write one file master documentation for all library files
                                                masterList();
                                            }
                                        });
                                    });
                                },
                                read = function terminal_commands_build_libReadme_read(erRead:Error, file:string):void {
                                    if (erRead !== null) {
                                        error(["Error reading file during documentation build task."]);
                                        return;
                                    }
                                    if ((/^\s*((\/\*)|(<!--)) \w+(\/\w+)+(\.d)? - \w/).test(file) === false) {
                                        error([
                                            "Code file missing required descriptive comment at top of code.",
                                            `${vars.text.angry + codeFiles[a] + vars.text.none}`,
                                            "--------------------------------------------------------------",
                                            "",
                                            "Include a comment prior to all other code.  Here is an example:",
                                            `${vars.text.cyan + vars.text.bold}/* lib/terminal/commands/remove - A command driven utility to recursively remove file system artifacts. */${vars.text.none}`,
                                            "",
                                            `${vars.text.underline}Requirements:${vars.text.none}`,
                                            `${vars.text.angry}*${vars.text.none} The comment occurs before all other code.  White space characters may reside prior to the comment, but nothing else.`,
                                            `${vars.text.angry}*${vars.text.none} For TypeScript files the comment must be of block comment type comprising a slash and asterisk: ${vars.text.green + vars.text.bold}/*${vars.text.none}`,
                                            `${vars.text.angry}*${vars.text.none} For Markdown files the comment must be a standard HTML comment: ${vars.text.green + vars.text.bold}<!--${vars.text.none}`,
                                            `${vars.text.angry}*${vars.text.none} The comment comprises three parts in this order:`,
                                            `   ${vars.text.angry}1${vars.text.none} A path to the file relative to the project root, without file extension, and using forward slash as the directory separator.`,
                                            `   ${vars.text.angry}2${vars.text.none} A separator comprising of a space, a hyphen, and a second space.`,
                                            `   ${vars.text.angry}3${vars.text.none} An English statement describing the code file.`
                                        ]);
                                        return;
                                    }
                                    const md:boolean = (file.replace(/^\s+/, "").indexOf("<!--") === 0),
                                        comment:string = (md === true)
                                            ? file.slice(file.indexOf("<!-- ") + 5, file.indexOf(" -->"))
                                            : file.slice(file.indexOf("/* ") + 3, file.indexOf(" */")),
                                        dashIndex:number = comment.indexOf(" - "),
                                        path:string[] = comment.slice(0, dashIndex).split("/"),
                                        name:string = path.pop(),
                                        extension:string = (md === true)
                                            ? "md"
                                            : "ts",
                                        doc:docItem = {
                                            description: comment.slice(dashIndex + 3),
                                            name: name,
                                            namePadded: `* **[${name}.${extension}](${name}.${extension})**`,
                                            path: path.join("/")
                                        };
                                    // Fourth, build the necessary data structure from reach the first comment of each file
                                    files.push(doc);
                                    // Fifth, once all TypeScript files are read the respective documentation content must be built
                                    a = a + 1;
                                    if (a < codeLength) {
                                        readFile(codeFiles[a], "utf8", terminal_commands_build_libReadme_read);
                                    } else {
                                        let aa:number = 1,
                                            b:number = 0,
                                            c:number = 0,
                                            longest:number = files[aa].name.length,
                                            list:string[] = [];
                                        const fileLength:number = files.length,
                                            buildList = function terminal_commands_build_libReadme_readFile_buildList():void {
                                                do {
                                                    c = files[b].name.length;
                                                    if (c < longest) {
                                                        do {
                                                            files[b].namePadded = `${files[b].namePadded}  `;
                                                            c = c + 1;
                                                        } while (c < longest);
                                                    }
                                                    list.push(`${files[b].namePadded} - ${files[b].description}`);
                                                    b = b + 1;
                                                } while (b < aa);
                                                write(files[b - 1].path, list.join("\n"));
                                            };
                                        files.sort(function terminal_commands_build_libReadme_readFile_sort(x:docItem, y:docItem):-1|1 {
                                            if (x.path < y.path) {
                                                return -1;
                                            }
                                            if (x.path === y.path && x.name < y.name) {
                                                return -1;
                                            }
                                            return 1;
                                        });
                                        master = files[aa].path.length + files[aa].name.length;
                                        do {
                                            if (files[aa].path === files[aa - 1].path) {
                                                if (files[aa].name.length > longest) {
                                                    longest = files[aa].name.length;
                                                }
                                                if (files[aa].path.length + files[aa].name.length > master) {
                                                    master = files[aa].path.length + files[aa].name.length;
                                                }
                                            } else {
                                                buildList();
                                                list = [];
                                                longest = 0;
                                            }
                                            aa = aa + 1;
                                        } while (aa < fileLength);
                                        buildList();
                                    }
                                },
                                nameTest = function terminal_commands_build_libReadme_nameTest(index:number, name:string):boolean {
                                    if (dirList[index][0].lastIndexOf(name) === dirList[index][0].length - name.length) {
                                        return true;
                                    }
                                    return false;
                                },
                                files:docItem[] = [],
                                codeFiles:string[] = [];
                            // Second, sort the directory data first by file types and then alphabetically
                            dirList.sort(function terminal_commands_build_libReadme_dirs_sort(x:directoryItem, y:directoryItem):number {
                                if (x[1] === "file" && y[1] !== "file") {
                                    return -1;
                                }
                                if (x[1] === "file" && y[1] === "file" && x[0] < y[0]) {
                                    return -1;
                                }
                                return 1;
                            });
                            // Third, gather the TypeScript and readme files
                            do {
                                if (dirList[a][1] === "file" && dirList[a][0].indexOf("storageBrowser") < 0 && (dirList[a][0].slice(dirList[a][0].length - 3) === ".ts" || (dirList[a][0].slice(dirList[a][0].length - 3) === ".md" && nameTest(a, "readme.md") === false))) {
                                    codeFiles.push(dirList[a][0]);
                                }
                                a = a + 1;
                            } while (a < length);
                            // Fourth, read from the files, the callback is recursive
                            a = 0;
                            codeLength = codeFiles.length;
                            readFile(codeFiles[0], "utf8", read);
                        },
                        dirConfig:readDirectory = {
                            callback: callback,
                            depth: 0,
                            exclusions: [],
                            mode: "read",
                            path: `${vars.projectPath}lib`,
                            symbolic: false
                        };
                    // First, get the file system data for the lib directory and then direct output to the dirs function
                    directory(dirConfig);
                    dirConfig.path = `${vars.projectPath}documentation`;
                    directory(dirConfig);
                },
                // phase lint is merely a call to the lint library
                lint: function terminal_commands_build_lint():void {
                    heading("Linting");
                    lint(testsCallback);
                },
                // same as NPM global install, but without NPM
                shellGlobal: function terminal_commands_build_shellGlobal():void {
                    heading(`Producing global shell command: ${vars.text.green + commandName + vars.text.none}`);
                    exec("npm root -g", function terminal_commands_build_shellGlobal_npm(err:Error, npm:string):void {
                        if (err === null) {
                            // commandName is attained from package.json
                            const globalPath:string = npm.replace(/\s+$/, "") + vars.sep + commandName,
                                bin:string = `${globalPath + vars.sep}bin`,
                                // cspell:disable
                                windows:boolean = (process.platform === "win32" || process.platform === "cygwin"),
                                // cspell:enable
                                files = function terminal_commands_build_shellGlobal_npm_files():void {
                                    let fileCount:number = 0;
                                    const nextString:string = "Writing global commands complete!",
                                        globalWrite = function terminal_commands_build_shellGlobal_npm_files_globalWrite():void {
                                            fileCount = fileCount + 1;
                                            if (windows === false || (windows === true && fileCount === 4)) {
                                                next(nextString);
                                            }
                                        },
                                        binName:string = `${bin + vars.sep + commandName}.mjs`;
                                    remove(binName, function terminal_commands_build_shellGlobal_npm_files_remove():void {
                                        readFile(`${vars.js}application.js`, {
                                            encoding: "utf8"
                                        }, function terminal_commands_build_shellGlobal_npm_files_remove_read(readError:Error, fileData:string):void {
                                            if (readError === null) {
                                                const injection:string[] = [
                                                        `vars.command_instruction="${commandName} ";`,
                                                        `vars.projectPath="${vars.projectPath.replace(/\\/g, "\\\\")}";`,
                                                        `vars.js="${vars.js.replace(/\\/g, "\\\\")}";`
                                                    ],
                                                    globalStart:number = fileData.indexOf("vars.command_instruction"),
                                                    globalEnd:number = fileData.indexOf("// end global"),
                                                    segments:string[] = [
                                                        "#!/usr/bin/env node\n",
                                                        fileData.slice(0, globalStart),
                                                        injection.join(""),
                                                        fileData.slice(globalEnd)
                                                    ];
                                                fileData = segments.join("").replace(/\.\/lib/g, `${vars.js.replace(/^\w:/, "").replace(/\\/g, "/")}lib`).replace("commandName(\"\")", `commandName("${commandName}")`);
                                                writeFile(binName, fileData, {
                                                    encoding: "utf8",
                                                    mode: 509
                                                }, function terminal_commands_build_shellGlobal_npm_files_remove_read_write():void {
                                                    if (windows === true) {
                                                        globalWrite();
                                                    } else {
                                                        const link:string = resolve(`${npm + vars.sep}..${vars.sep}..${vars.sep}bin${vars.sep + commandName}`);
                                                        remove(link, function terminal_commands_build_shellGlobal_npm_files_remove_read_write_link():void {
                                                            symlink(binName, link, globalWrite);
                                                        });
                                                    }
                                                });
                                            } else {
                                                error([readError.toString()]);
                                            }
                                        });
                                    });
                                    if (windows === true) {
                                        // cspell:disable
                                        // The three following strings follow conventions created by NPM.
                                        // * See /documentation/credits.md for license information
                                        const cyg:string = `#!/bin/sh\nbasedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")\n\ncase \`uname\` in\n    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;\nesac\n\nif [ -x "$basedir/node" ]; then\n  exec "$basedir/node"  "$basedir/node_modules/${commandName}/bin/${commandName}.mjs" "$@"\nelse\n  exec node  "$basedir/node_modules/${commandName}/bin/${commandName}.mjs" "$@"\nfi\n`,
                                            cmd:string = `@ECHO off\r\nGOTO start\r\n:find_dp0\r\nSET dp0=%~dp0\r\nEXIT /b\r\n:start\r\nSETLOCAL\r\nCALL :find_dp0\r\n\r\nIF EXIST "%dp0%\\node.exe" (\r\n  SET "_prog=%dp0%\\node.exe"\r\n) ELSE (\r\n  SET "_prog=node"\r\n  SET PATHEXT=%PATHEXT:;.JS;=;%\r\n)\r\n\r\nendLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\\node_modules\\${commandName}\\bin\\${commandName}.mjs" %*\r\n`,
                                            ps1:string = `#!/usr/bin/env pwsh\n$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent\n\n$exe=""\nif ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {\n  $exe=".exe"\n}\n$ret=0\nif (Test-Path "$basedir/node$exe") {\n  if ($MyInvocation.ExpectingInput) {\n    $input | & "$basedir/node$exe"  "$basedir/node_modules/${commandName}/bin/${commandName}.mjs" $args\n  } else {\n    & "$basedir/node$exe"  "$basedir/node_modules/${commandName}/bin/${commandName}.mjs" $args\n  }\n  $ret=$LASTEXITCODE\n} else {\n  if ($MyInvocation.ExpectingInput) {\n    $input | & "node$exe"  "$basedir/node_modules/${commandName}/bin/${commandName}.mjs" $args\n  } else {\n    & "node$exe"  "$basedir/node_modules/${commandName}/bin/${commandName}.mjs" $args\n  }\n  $ret=$LASTEXITCODE\n}\nexit $ret\n`,
                                            // cspell:enable
                                            dir:string = npm.replace(/node_modules\s*$/, "");
                                        writeFile(dir + commandName, cyg, {
                                            encoding: "utf8"
                                        }, globalWrite);
                                        writeFile(`${dir + commandName}.cmd`, cmd, {
                                            encoding: "utf8"
                                        }, globalWrite);
                                        writeFile(`${dir + commandName}.ps1`, ps1, {
                                            encoding: "utf8"
                                        }, globalWrite);
                                    }
                                };
                            stat(bin, function terminal_commands_build_shellGlobal_npm_stat(errs:NodeJS.ErrnoException):void {
                                if (errs === null) {
                                    files();
                                } else {
                                    if (errs.code === "ENOENT") {
                                        if (windows === true) {
                                            makeDir(bin, files);
                                        } else {
                                            makeDir(bin, function terminal_commands_build_shellGlobal_npm_stat_makeDir():void {
                                                exec(`chmod 775 ${bin}`, function terminal_commands_build_shellGlobal_npm_stat_makeDir_chmod():void {
                                                    files();
                                                });
                                            });
                                        }
                                    } else {
                                        error([errs.toString()]);
                                    }
                                }
                            });
                        } else {
                            error([`Error executing child process: ${vars.text.cyan}npm root -g${vars.text.none}`, err.toString()]);
                        }
                    });
                },
                // phase typescript compiles the working code into JavaScript
                typescript: function terminal_commands_build_typescript():void {
                    const incremental:string = (process.argv.indexOf("incremental") > -1)
                            ? "--incremental"
                            : "--pretty",
                        command:string = (process.argv.indexOf("local") > -1)
                            ? `node_modules\\.bin\\tsc ${incremental}`
                            : `tsc ${incremental}`,
                        ts = function terminal_commands_build_typescript_ts():void {
                            exec(command, {
                                cwd: vars.projectPath
                            }, function terminal_commands_build_typescript_callback(err:Error, stdout:string, stderr:string):void {
                                const control:string = "\u001b[91m";
                                if (stdout !== "" && stdout.indexOf(` ${control}error${vars.text.none} `) > -1) {
                                    error([`${vars.text.red}TypeScript reported warnings.${vars.text.none}`, stdout]);
                                    return;
                                }
                                log([stdout]);
                                if (err !== null) {
                                    error([err.toString()]);
                                    return;
                                }
                                if (stderr !== "") {
                                    error([stderr]);
                                    return;
                                }
                                next("TypeScript build completed without warnings.");
                            });
                        };
                    heading("TypeScript Compilation");
                    exec("tsc --version", function terminal_commands_build_typescript_tsc(err:Error, stdout:string, stderr:string) {
                        if (err !== null) {
                            const str:string = err.toString();
                            if (str.indexOf("command not found") > 0 || str.indexOf("is not recognized") > 0) {
                                log([`${vars.text.angry}TypeScript does not appear to be globally installed.${vars.text.none}`]);
                            } else {
                                error([err.toString(), stdout]);
                                return;
                            }
                        } else {
                            if (stderr !== "") {
                                error([stderr]);
                                return;
                            }
                            ts();
                        }
                    });
                },
                // write the current version, change date, and modify html
                version: function terminal_commands_build_version():void {
                    const pack:string = `${vars.projectPath}package.json`,
                        configPath:string = `${vars.projectPath}lib${vars.sep}configurations.json`,
                        packStat = function terminal_commands_build_version_packStat(ers:Error, statPackage:Stats):void {
                            if (ers !== null) {
                                error([ers.toString()]);
                                return;
                            }
                            const readPack = function terminal_commands_build_version_packStat_readPack(err:Error, data:string):void {
                                    if (err !== null) {
                                        error([err.toString()]);
                                        return;
                                    }

                                    // eslint-disable-next-line
                                    const packageData:packageJSON = JSON.parse(data),
                                        commitHash = function terminal_commands_build_version_packStat_readPack_commitHash(hashErr:Error, stdout:string, stderr:string):void {
                                            const flag:flagList = {
                                                    config: false,
                                                    package: false
                                                },
                                                version:version = {
                                                    date: vars.date,
                                                    git_hash: stdout.replace(/\s+/g, ""),
                                                    version: packageData.version
                                                },
                                                readConfig = function terminal_commands_build_version_packStat_readPack_commitHash_readConfig(err:Error, configFile:string):void {
                                                    if (err !== null) {
                                                        error([err.toString()]);
                                                        return;
                                                    }
                                                    // eslint-disable-next-line
                                                    const config:configurationApplication = JSON.parse(configFile),
                                                        writeConfig = function terminal_commands_build_version_packStat_readPack_commitHash_readConfig_writeConfig(erc:Error):void {
                                                            if (erc !== null) {
                                                                error([erc.toString()]);
                                                                return;
                                                            }
                                                            flag.config = true;
                                                            if (flag.package === true) {
                                                                next("Version data written");
                                                            }
                                                        };
                                                    config["package-lock.json"].version = vars.version;
                                                    writeFile(configPath, JSON.stringify(config), "utf8", writeConfig);
                                                },
                                                versionWrite = function terminal_commands_build_version_packStat_readPack_commitHash_packageWrite(err:Error):void {
                                                    if (err === null) {
                                                        flag.package = true;
                                                        if (flag.config === true) {
                                                            next("Version data written");
                                                        }
                                                    }
                                                };
                
                                            if (hashErr !== null) {
                                                error([hashErr.toString()]);
                                                return;
                                            }
                                            if (stderr !== "") {
                                                error([stderr]);
                                                return;
                                            }
                
                                            vars.git_hash = version.git_hash;
                                            vars.version = packageData.version;
                
                                            // modify configuration.json
                                            readFile(configPath, "utf8", readConfig);

                                            // write version data
                                            writeFile(`${vars.projectPath}version.json`, JSON.stringify(version), versionWrite);
                                        },
                                        gitStat = function terminal_commands_build_version_packStat_readPack_gitStat(gitError:Error):void {
                                            if (gitError === null) {
                                                exec("git rev-parse HEAD", {
                                                    cwd: vars.projectPath
                                                }, commitHash);
                                            } else {
                                                commitHash(null, "", "");
                                            }
                                        };
                                    stat(`${vars.projectPath}.git`, gitStat);
                                    commandName = packageData.command;
                                },
                                month:string = (function terminal_commands_build_version_packStat_month():string {
                                    let numb:number = statPackage.mtime.getMonth();
                                    if (numb === 0) {
                                        return "JAN";
                                    }
                                    if (numb === 1) {
                                        return "FEB";
                                    }
                                    if (numb === 2) {
                                        return "MAR";
                                    }
                                    if (numb === 3) {
                                        return "APR";
                                    }
                                    if (numb === 4) {
                                        return "MAY";
                                    }
                                    if (numb === 5) {
                                        return "JUN";
                                    }
                                    if (numb === 6) {
                                        return "JUL";
                                    }
                                    if (numb === 7) {
                                        return "AUG";
                                    }
                                    if (numb === 8) {
                                        return "SEP";
                                    }
                                    if (numb === 9) {
                                        return "OCT";
                                    }
                                    if (numb === 10) {
                                        return "NOV";
                                    }
                                    if (numb === 11) {
                                        return "DEC";
                                    }
                                }()),
                                dayString:string = statPackage.mtime.getDate().toString(),
                                dayPadded:string = (dayString.length < 2)
                                    ? `0${dayString}`
                                    : dayString,
                                date:string = `${dayPadded} ${month} ${statPackage.mtime.getFullYear().toString()}`;
                            vars.date = date.replace(/-/g, "");
    
                            // read package.json
                            readFile(pack, "utf8", readPack);
                        };
                    heading("Writing version data");
                    stat(pack, packStat);
                }
            };
        if (test === false || test === undefined) {
            log.title("Run All Build Tasks");
        }
        next("");
    };
export default build;