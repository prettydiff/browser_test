# lib/terminal/utilities Code Files
The various utility libraries for the terminal instance of the application.

## Files
<!-- Do not edit below this line.  Contents dynamically populated. -->

* **[commandList.ts](commandList.ts)**                       - Groups all supported command functions into an object for single point of reference.
* **[commandName.ts](commandName.ts)**                       - A library for visually presenting command documentation to the terminal.
* **[commands_documentation.ts](commands_documentation.ts)** - A data structure defining command documentation with usage examples.
* **[configuration.ts](configuration.ts)**                   - Stores configuration values.
* **[error.ts](error.ts)**                                   - A utility for processing and logging errors from the terminal application.
* **[file_path_decode.ts](file_path_decode.ts)**             - Transforms a custom encoded file path into a local operation system specific file path.
* **[file_path_encode.ts](file_path_encode.ts)**             - Creates an encoding around file system addresses so that the test code can ensure the paths are properly formed per operating system.
* **[humanTime.ts](humanTime.ts)**                           - A utility to generate human readable time sequences.
* **[lists.ts](lists.ts)**                                   - A utility for visually presenting lists of data to the terminal's console.
* **[log.ts](log.ts)**                                       - A log utility for displaying multiple lines of text to the terminal.
* **[time.ts](time.ts)**                                     - Generates a timestamp in format: "[HH:mm:ss:mil] message".
* **[vars.ts](vars.ts)**                                     - Globally available variables for the terminal utility.
* **[wrapIt.ts](wrapIt.ts)**                                 - A tool to perform word wrap when printing text to the shell.