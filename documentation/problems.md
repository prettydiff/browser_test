
<!-- documentation/problems - A list of problems I have encountered and have not solved. -->

# drial - Problems
This is a list of unsolved problems I have encountered:

## drial
A list of problems or shortcomings identified to this application.

* The CDP allows for access to various windows, tabs, and pages simultaneously via a loaderId and frameId.  I have not provided access to anything beyond the primary page frame that opens as the browser window opens.  This will require some additional logic to identify various frames by frameId and I will need to update the TypeScript interface for the campaigns to allow users to identify different frames.
  - Challenge: The challenge is that these various containers are identified using a dynamic hash scheme.  Associating that back to a static document that is maintained by end users requires some planning.
  - Business Case: An interaction that spawns a popup or new tab should allow testing in both the originating page as well as the spawned page.

## Chrome
A list of problems attributed to the Chrome browser.

* Setting the flag `--auto-open-devtools-for-tabs` causes the browser to error when a page address is specified via CDP.  This appears to be a Chrome developer tools defect after reading the Chromium project source code at the indicated location
  - Error message: `[16280:17676:0718/142416.732:ERROR:devtools_ui_bindings.cc(1651)] Attempt to navigate to an invalid DevTools front-end URL: https://www.bankofamerica.com/`
  - Defect report: https://bugs.chromium.org/p/chromium/issues/detail?id=1230398
* Cannot create tabs.  When manually clicking on a hyperlink that contains a `target="_blank"` attribute using a mouse a new page tab is created with contain from the requested hyperlink location.  This is the desired behavior.  When you perform the same behavior using `event.initEvent` and `element.dispatchEvent` methods CDP reports the `Page.windowOpen` behavior.  HTTP requests to `/json/list` also report the new page at the desired location.  Despite that messaging from the browser no new tab is created in the chrome of the browser.  It does not exist, there is nothing to interact with, and the devtools running in the browser sees no new tab and reports no additional network traffic.
  - Defect report: https://bugs.chromium.org/p/chromium/issues/detail?id=1231082

## Firefox
A list of problems attributed to the Firefox browser.