
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

## Firefox
A list of problems attributed to the Firefox browser.

* At this time **Firefox is not supported** and will error due to missing support for a feature required by this application.  That missing feature is *Page.addScriptToEvaluateOnNewDocument* of the CDP as described in [Firefox defect 1601695](https://bugzilla.mozilla.org/show_bug.cgi?id=1601695).  This application is otherwise written to provide full support for Firefox.