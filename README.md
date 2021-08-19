# LibreTexts Adoption Report Widget
This repository hosts the codebase for the LibreTexts Adoption Report Widget
for use on the LibreTexts Libraries.

## Prerequisites
The Adoption Report widget relies on jQuery and will not initialize if the
library is missing. jQuery should already be available on LibreTexts
library pages.

## Parameters
1. Resource *ID*: the standard LibreTexts identifier, e.g. `eng-48536`.
2. Resource *Title*: the full title of the text, e.g.
*Alternative Fuels from Biomass Sources (Toraman)*.
3. Resource *Library*: the full name of the library, e.g. *engineering*
(case does not matter).

## How to Use
1. Download the `dist` folder.
2. Include the `libreAdoptionReport.js` script at the end of the `<body>`
section in standard fashion. *Note that while only the JS file needs to be
explicitly included, the font files must be available in the same
relative folder path.*
```
<script type='text/javascript' src='./dist/libreAdoptionReport.js'></script>
```
3. Create a "Submit Adoption Report" button and register an *onClick* function
that calls `window.libreAdoptionReport.init()`, passing the resource *ID*,
*Title*, and *Library Name* (see the *Parameters* section). For example:
```
$("#libreAdoptionReportBtn").click(function() {
    window.libreAdoptionReport.init("eng-1000", "Book: Intro to Java",
    "engineering");
});
```
That's it!

## Conflict Considerations
Several steps have been taken to avoid HTML, Javascript, and CSS conflicts with
pre-existing code on the LibreTexts libraries. Only the minimum amount of
Semantic UI files necessary are included in the bundle.

### HTML & CSS
* Element IDs generally follow the `libreAR-internal-name` scheme.
* Class names generally follow the `ar-internal-class` scheme, save for Semantic
UI classes that generally follow the `ui <element>` scheme.

### Javascript/jQuery
* The underlying JS code does NOT make any use of the standard jQuery `$`
reference name/variable. All jQuery usage relies on the global `window.jQuery`
object/property and references are often passed internally.

## Security/Access Control Considerations
Conductor, the platform that handles Adoption Report submissions, only accepts
AJAX requests from pages hosted on the `libretexts.org` domain. Further security
features are incoming.

## Attributions
The Adoption Report Widget makes use of a stripped-down version of
[Semantic UI 2.4.1](https://semantic-ui.com/), which is available under the
[MIT license](https://opensource.org/licenses/MIT).
