
<!-- documentation/browsers - This documentation describes browser specific information necessary for testing and execution. -->

# drial - Browser documentation

## Notes
In the following documentation the port 9000 is used.  Any open port is acceptable, which is any unused port number from 1-65535.  A provided value of 0 means the application will randomly choose an available port.  Multiple browsers can be tested simultaneously, but they cannot share the same port numbers.

Each browser that ships their own developer tools package provides their own proprietary protocol and documentation.  However most modern browsers appear to also support the Chrome DevTools Protocol (CDP) for remote access: https://chromedevtools.github.io/devtools-protocol/

## Executing terminal applications
The following documentation uses the `start` command to launch the application.  The command name per operating system is as follows:

* Windows - `start`
* OSX - `open`
* Linux - `xdg-open` (most Linux distributions, but may vary)

## Browsers
The actual documentation per browser.

### Chrome
* **Execution** - `path_to_chrome about:blank --no-first-run --no-default-browser-check --disable-popup-blocking --remote-debugging-port=9000`
  - Optionally the following flag can also be used to disable same origin policy: `--disable-web-security`
  - Optionally open the browser with the developer tools already visible: `--auto-open-devtools-for-tabs`
* **Documentation**
  - Command line options - https://peter.sh/experiments/chromium-command-line-switches/
  - Developer Tools Protocol - https://chromedevtools.github.io/devtools-protocol/
* **Configuration** - none

### Firefox
* **Support** - At this time **Firefox is not supported** and will error due to missing support for a feature required by this application.  That missing feature is *Page.addScriptToEvaluateOnNewDocument* of the CDP as described in [Firefox defect 1601695](https://bugzilla.mozilla.org/show_bug.cgi?id=1601695).  This application is otherwise written to provide full support for Firefox.
* **Execution** - `path_to_firefox about:blank --vvv --remote-debugging-server=9000`
  - Optionally open the browser with the developer tools already visible: `--devtools`
* **Documentation**
  - Command line options - http://kb.mozillazine.org/Command_line_arguments#:~:text=List%20of%20command%20line%20arguments%20%28incomplete%29%20%20,%20firefox.exe%20-safe-mode%20%2014%20more%20rows%20
  - More Command line options - https://www.cyberciti.biz/faq/howto-run-firefox-from-the-command-line/
  - Developer Tools Protocol - https://firefox-source-docs.mozilla.org/remote/index.html (additional to Chrome's Developer Tools Protocol, CDP)
  - Browser Preparation for CDP - https://firefox-source-docs.mozilla.org/devtools/getting-started/development-profiles.html
  - Logging modules - https://searchfox.org/mozilla-central/search?q=LazyLogModule.*%22&path=&case=false&regexp=true
* **Configuration**
  - In the browser go to page `about:config` and change these by searching for them and double clicking them:

    flag | value
    ---|---
    `browser.dom.window.dump.enabled`     | **true**
    `browser.shell.checkDefaultBrowser`   | **false**
    `devtools.chrome.enable`              | **true**
    `devtools.console.stdout.chrome`      | **true**
    `devtools.console.stdout.content`     | **true**
    `devtools.debugger.log`               | **true**
    `devtools.debugger.logging`           | **true**
    `devtools.debugger.prompt-connection` | **false**
    `devtools.debugger.remote-enabled`    | **true**
    `devtools.dump.emit`                  | **true**

### Safari
https://webkit.org/web-inspector/enabling-web-inspector/

Safari is a bit of a mystery due to limited documentation from Apple and a strong preference for digging into Safari Web Inspector code classes via XCode.

**Safari is not supported without additional guidance and documentation**

### Edge
See the *Chrome* section above. Edge browser is identified by the operating system as **msedge**, but the browser name *edge* is accepted by this application.

### Opera
See the *Chrome* section above.

### Brave
See the *Chrome* section above.

### Vivaldi
See the *Chrome* section above.

### Internet Explorer
**Not supported.**  At the time of this writing (July 2021) Internet Explorer was sunset by Microsoft on 30 November 2020 and achieves end of life on 15 June 2022.  This means support for Internet Explorer's vendor has already terminated support except for critical security patches and critical security patches will be terminated in less than a year.  Internet Explorer is classified by Microsoft as an operating system component instead of an installed application.  As a result any Windows operating system security update after June 2022 may arbitrarily remove Internet Explorer from user's computers.

* https://docs.microsoft.com/en-us/lifecycle/faq/internet-explorer-microsoft-edge