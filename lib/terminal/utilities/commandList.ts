
/* lib/terminal/utilities/commandList - Groups all supported command functions into an object for single point of reference. */

import build from "../commands/build.js";
import commands from "../commands/commands.js";
import directory from "../commands/directory.js";
import drial from "../commands/drial.js";
import get from "../commands/get.js";
import lint from "../commands/lint.js";
import mkdir from "../commands/mkdir.js";
import remove from "../commands/remove.js";
import test from "../commands/test.js";
import update from "../commands/update.js";
import version from "../commands/version.js";

const commandList:commandList = {
    build: build,
    commands: commands,
    directory: directory,
    drial: drial,
    get: get,
    lint: lint,
    mkdir: mkdir,
    remove: remove,
    test: test,
    update: update,
    version: version
};

export default commandList;