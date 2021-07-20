
/* lib/terminal/utilities/commandList - Groups all supported command functions into an object for single point of reference. */

import build from "../commands/build.js";
import commands from "../commands/commands.js";
import copy from "../commands/copy.js";
import directory from "../commands/directory.js";
import get from "../commands/get.js";
import lint from "../commands/lint.js";
import mkdir from "../commands/mkdir.js";
import remove from "../commands/remove.js";
import update from "../commands/update.js";
import version from "../commands/version.js";
import websites from "../commands/websites.js";

const commandList:commandList = {
    build: build,
    commands: commands,
    copy: copy,
    directory: directory,
    get: get,
    lint: lint,
    mkdir: mkdir,
    remove: remove,
    update: update,
    version: version,
    websites: websites
};

export default commandList;