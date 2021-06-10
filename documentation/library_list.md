<!-- documentation/library_list - Automated list of all code and documentation files with brief descriptions. -->

# Share File Systems - Code Library List
This is a dynamically compiled list of supporting code files that comprise this application with a brief description of each file.

* Directory *[../documentation](../documentation)*
   - **[commands.md](commands.md)**                                                                                 - This documentation describes the various supported terminal commands and is automatically generated from `lib/terminal/utilities/commands_documentation.ts`.
* Directory *[../lib](../lib)*
   - **[../lib/application.ts](../lib/application.ts)**                                                             - The entry point to the application.
* Directory *[../lib/common](../lib/common)*
   - **[../lib/common/common.ts](../lib/common/common.ts)**                                                         - A collection of tools available to any environment.
   - **[../lib/common/disallowed.ts](../lib/common/disallowed.ts)**                                                 - Reassignments from default conventions that either dated or most frequently misused.
* Directory *[../lib/terminal/commands](../lib/terminal/commands)*
   - **[../lib/terminal/commands/build.ts](../lib/terminal/commands/build.ts)**                                     - The library that executes the build and test tasks.
   - **[../lib/terminal/commands/commands.ts](../lib/terminal/commands/commands.ts)**                               - A command driven utility to list available commands and their respective documentation.
   - **[../lib/terminal/commands/directory.ts](../lib/terminal/commands/directory.ts)**                             - A command driven utility to walk the file system and return a data structure.
   - **[../lib/terminal/commands/drial.ts](../lib/terminal/commands/drial.ts)**                                     - The primary application command.
   - **[../lib/terminal/commands/get.ts](../lib/terminal/commands/get.ts)**                                         - A command driven utility to fetch resources from across the internet via HTTP method GET.
   - **[../lib/terminal/commands/lint.ts](../lib/terminal/commands/lint.ts)**                                       - A command driven wrapper for executing external application ESLint.
   - **[../lib/terminal/commands/mkdir.ts](../lib/terminal/commands/mkdir.ts)**                                     - A utility for recursively creating directories in the file system.
   - **[../lib/terminal/commands/remove.ts](../lib/terminal/commands/remove.ts)**                                   - A command driven utility to recursively remove file system artifacts.
   - **[../lib/terminal/commands/test.ts](../lib/terminal/commands/test.ts)**                                       - A command driven wrapper for all test utilities.
   - **[../lib/terminal/commands/update.ts](../lib/terminal/commands/update.ts)**                                   - A command to update the application from git and then run the build.
   - **[../lib/terminal/commands/version.ts](../lib/terminal/commands/version.ts)**                                 - A command utility for expressing the application's version.
* Directory *[../lib/terminal/utilities](../lib/terminal/utilities)*
   - **[../lib/terminal/utilities/commandList.ts](../lib/terminal/utilities/commandList.ts)**                       - Groups all supported command functions into an object for single point of reference.
   - **[../lib/terminal/utilities/commandName.ts](../lib/terminal/utilities/commandName.ts)**                       - A library for visually presenting command documentation to the terminal.
   - **[../lib/terminal/utilities/commands_documentation.ts](../lib/terminal/utilities/commands_documentation.ts)** - A data structure defining command documentation with usage examples.
   - **[../lib/terminal/utilities/error.ts](../lib/terminal/utilities/error.ts)**                                   - A utility for processing and logging errors from the terminal application.
   - **[../lib/terminal/utilities/humanTime.ts](../lib/terminal/utilities/humanTime.ts)**                           - A utility to generate human readable time sequences.
   - **[../lib/terminal/utilities/lists.ts](../lib/terminal/utilities/lists.ts)**                                   - A utility for visually presenting lists of data to the terminal's console.
   - **[../lib/terminal/utilities/log.ts](../lib/terminal/utilities/log.ts)**                                       - A log utility for displaying multiple lines of text to the terminal.
   - **[../lib/terminal/utilities/vars.ts](../lib/terminal/utilities/vars.ts)**                                     - Globally available variables for the terminal utility.
   - **[../lib/terminal/utilities/wrapIt.ts](../lib/terminal/utilities/wrapIt.ts)**                                 - A tool to perform word wrap when printing text to the shell.
* Directory *[../lib/typescript](../lib/typescript)*
   - **[../lib/typescript/environment.d.ts](../lib/typescript/environment.d.ts)**                                   - TypeScript interfaces that define environmental objects.
   - **[../lib/typescript/global.d.ts](../lib/typescript/global.d.ts)**                                             - TypeScript interfaces used in many unrelated areas of the application.
   - **[../lib/typescript/terminal.d.ts](../lib/typescript/terminal.d.ts)**                                         - TypeScript interfaces used by terminal specific libraries.
   - **[../lib/typescript/types.d.ts](../lib/typescript/types.d.ts)**                                               - TypeScript static types.