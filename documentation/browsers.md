
<!-- documentation/browsers - This documentation describes browser specific information necessary for testing and execution. -->

# drial - Browser documentation

## Notes
In the following documentation the port 9000 is used.  Any open port is acceptable, which is any unused port number from 1-65535.  A provided value of 0 means the application will randomly choose an available port.  Multiple browsers can be tested simultaneously, but they cannot share the same port numbers.

Each browser that ships their own developer tools package provides their own proprietary protocol and documentation.  However most modern browsers appear to also support the Chrome Developer Tools Protocol (CDP) for remote access: https://chromedevtools.github.io/devtools-protocol/

## Executing terminal applications
The following documentation uses the `start` command to launch the application.  The command name per operating system is as follows:

* Windows - `start`
* OSX - `open`
* Linux - `xdg-open` (most Linux distributions, but may vary)

## Browsers
The actual documentation per browser.

### Chrome
* **Execution** - `start chrome --remote-debugging-port=9000 --no-first-run --no-default-browser-check`
   - Optionally the following flag can also be used to disable same origin policy: `--disable-web-security`
* **Documentation**
   - Command line options - https://peter.sh/experiments/chromium-command-line-switches/
   - Developer Tools Protocol - https://chromedevtools.github.io/devtools-protocol/
* **Configuration** - none

### Firefox
* **Execution** - `start firefox -start-debugger-server 9000`
* **Documentation**
   - Command line options - https://developer.mozilla.org/en-US/docs/Mozilla/Command_Line_Options?redirectlocale=en-US&redirectslug=Command_Line_Options
   - Developer Tools Protocol - https://firefox-source-docs.mozilla.org/remote/index.html
* **Configuration**
   - In the browser go to page `about:config` and change these by searching for them and double clicking them:
      * `browser.shell.checkDefaultBrowser` - value **false**
      * `devtools.chrome.enable` - value **true**
      * `devtools.debugger.prompt-connection` - value **false**
      * `devtools.debugger.remote-enabled` - value **true**

### Safari
https://webkit.org/web-inspector/enabling-web-inspector/

Safari is a bit of a mystery due to limited documentation from Apple and a strong preference for digging into Safari Web Inspector code classes via XCode.

**Safari is not supported without additional guidance and documentation**

### Edge
See the *Chrome* section above.

### Opera
See the *Chrome* section above.

### Brave
See the *Chrome* section above.

### Vivaldi
See the *Chrome* section above.

### Internet Explorer
**Not supported.**  At the time of this writing (July 2021) Internet Explorer was sunset by Microsoft on 30 November 2020 and achieves end of life on 15 June 2022.  This means support for Internet Explorer's vendor has already terminated support except for critical security patches and critical security patches will be terminated in less than a year.  Internet Explorer is classified by Microsoft as an operating system component instead of an installed application.  As a result any Windows operating system security update after June 2022 may arbitrarily remove Internet Explorer from user's computers.

* https://docs.microsoft.com/en-us/lifecycle/faq/internet-explorer-microsoft-edge