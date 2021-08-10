<!-- documentation/library_list - Automated list of all code and documentation files with brief descriptions. -->

# Share File Systems - Code Library List
This is a dynamically compiled list of supporting code files that comprise this application with a brief description of each file.

* Directory *[../documentation](../documentation)*
   - **[browsers.md](browsers.md)**                                                                                 - This documentation describes browser specific information necessary for testing and execution.
   - **[commands.md](commands.md)**                                                                                 - This documentation describes the various supported terminal commands and is automatically generated from `lib/terminal/utilities/commands_documentation.ts`.
   - **[configuration.md](configuration.md)**                                                                       - How to use and modify this application.
   - **[library_list.md](library_list.md)**                                                                         - Automated list of all code and documentation files with brief descriptions.
   - **[problems.md](problems.md)**                                                                                 - A list of problems I have encountered and have not solved.
   - **[website_tests.md](website_tests.md)**                                                                       - How this application defines tests for websites.
* Directory *[../lib/browser](../lib/browser)*
   - **[../lib/browser/remote.ts](../lib/browser/remote.ts)**                                                       - A collection of instructions to allow event execution from outside the browser, like a remote control.
* Directory *[../lib/common](../lib/common)*
   - **[../lib/common/common.ts](../lib/common/common.ts)**                                                         - A collection of tools available to any environment.
   - **[../lib/common/disallowed.ts](../lib/common/disallowed.ts)**                                                 - Reassignments from default conventions that either dated or most frequently misused.
* Directory *[../lib/terminal/commands](../lib/terminal/commands)*
   - **[../lib/terminal/commands/build.ts](../lib/terminal/commands/build.ts)**                                     - The library that executes the build and test tasks.
   - **[../lib/terminal/commands/commands.ts](../lib/terminal/commands/commands.ts)**                               - A command driven utility to list available commands and their respective documentation.
   - **[../lib/terminal/commands/copy.ts](../lib/terminal/commands/copy.ts)**                                       - A command driven utility to perform bit by bit file artifact copy.
   - **[../lib/terminal/commands/directory.ts](../lib/terminal/commands/directory.ts)**                             - A command driven utility to walk the file system and return a data structure.
   - **[../lib/terminal/commands/lint.ts](../lib/terminal/commands/lint.ts)**                                       - A command driven wrapper for executing external application ESLint.
   - **[../lib/terminal/commands/makeDir.ts](../lib/terminal/commands/makeDir.ts)**                                 - A utility for recursively creating directories in the file system.
   - **[../lib/terminal/commands/remove.ts](../lib/terminal/commands/remove.ts)**                                   - A command driven utility to recursively remove file system artifacts.
   - **[../lib/terminal/commands/request.ts](../lib/terminal/commands/request.ts)**                                 - A command driven utility to fetch resources from across the internet via HTTP method GET.
   - **[../lib/terminal/commands/update.ts](../lib/terminal/commands/update.ts)**                                   - A command to update the application from git and then run the build.
   - **[../lib/terminal/commands/version.ts](../lib/terminal/commands/version.ts)**                                 - A command utility for expressing the application's version.
   - **[../lib/terminal/commands/websites.ts](../lib/terminal/commands/websites.ts)**                               - A command driven wrapper for all test utilities.
* Directory *[../lib/terminal/utilities](../lib/terminal/utilities)*
   - **[../lib/terminal/utilities/commandList.ts](../lib/terminal/utilities/commandList.ts)**                       - Groups all supported command functions into an object for single point of reference.
   - **[../lib/terminal/utilities/commandName.ts](../lib/terminal/utilities/commandName.ts)**                       - A library for visually presenting command documentation to the terminal.
   - **[../lib/terminal/utilities/commands_documentation.ts](../lib/terminal/utilities/commands_documentation.ts)** - A data structure defining command documentation with usage examples.
   - **[../lib/terminal/utilities/configuration.ts](../lib/terminal/utilities/configuration.ts)**                   - Stores configuration values.
   - **[../lib/terminal/utilities/error.ts](../lib/terminal/utilities/error.ts)**                                   - A utility for processing and logging errors from the terminal application.
   - **[../lib/terminal/utilities/file_path_decode.ts](../lib/terminal/utilities/file_path_decode.ts)**             - Transforms a custom encoded file path into a local operation system specific file path.
   - **[../lib/terminal/utilities/file_path_encode.ts](../lib/terminal/utilities/file_path_encode.ts)**             - Creates an encoding around file system addresses so that the test code can ensure the paths are properly formed per operating system.
   - **[../lib/terminal/utilities/humanTime.ts](../lib/terminal/utilities/humanTime.ts)**                           - A utility to generate human readable time sequences.
   - **[../lib/terminal/utilities/lists.ts](../lib/terminal/utilities/lists.ts)**                                   - A utility for visually presenting lists of data to the terminal's console.
   - **[../lib/terminal/utilities/log.ts](../lib/terminal/utilities/log.ts)**                                       - A log utility for displaying multiple lines of text to the terminal.
   - **[../lib/terminal/utilities/time.ts](../lib/terminal/utilities/time.ts)**                                     - Generates a timestamp in format: "[HH:mm:ss:mil] message".
   - **[../lib/terminal/utilities/vars.ts](../lib/terminal/utilities/vars.ts)**                                     - Globally available variables for the terminal utility.
   - **[../lib/terminal/utilities/wrapIt.ts](../lib/terminal/utilities/wrapIt.ts)**                                 - A tool to perform word wrap when printing text to the shell.
* Directory *[../lib/terminal/websites](../lib/terminal/websites)*
   - **[../lib/terminal/websites/index.ts](../lib/terminal/websites/index.ts)**                                     - The code that allows testing of websites.
   - **[../lib/terminal/websites/iterate.ts](../lib/terminal/websites/iterate.ts)**                                 - Push the next test item.
   - **[../lib/terminal/websites/listener.ts](../lib/terminal/websites/listener.ts)**                               - A service listener that processes input and output to the web browser.
   - **[../lib/terminal/websites/message.ts](../lib/terminal/websites/message.ts)**                                 - Message input/output to the browser via Chrome Developer Tools Protocol (CDP).
   - **[../lib/terminal/websites/openBrowser.ts](../lib/terminal/websites/openBrowser.ts)**                         - Launches the web browser with all necessary configurations in place.
   - **[../lib/terminal/websites/requestTargetList.ts](../lib/terminal/websites/requestTargetList.ts)**             - Get a list of pages from the browser.
   - **[../lib/terminal/websites/results.ts](../lib/terminal/websites/results.ts)**                                 - Processes test result data into output for humans to read.
   - **[../lib/terminal/websites/server.ts](../lib/terminal/websites/server.ts)**                                   - A simple HTTP server to keep the application open listening for browser output.
* Directory *[../lib/typescript](../lib/typescript)*
   - **[../lib/typescript/browser.d.ts](../lib/typescript/browser.d.ts)**                                           - TypeScript interfaces used by browser specific libraries.
   - **[../lib/typescript/environment.d.ts](../lib/typescript/environment.d.ts)**                                   - TypeScript interfaces that define environmental objects.
   - **[../lib/typescript/global.d.ts](../lib/typescript/global.d.ts)**                                             - TypeScript interfaces used in many unrelated areas of the application.
   - **[../lib/typescript/terminal.d.ts](../lib/typescript/terminal.d.ts)**                                         - TypeScript interfaces used by terminal specific libraries.
   - **[../lib/typescript/test.d.ts](../lib/typescript/test.d.ts)**                                                 - TypeScript interfaces used test automation.
   - **[../lib/typescript/types.d.ts](../lib/typescript/types.d.ts)**                                               - TypeScript static types.