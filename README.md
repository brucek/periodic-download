# periodic-download
App for freelancer tests.

  * NOTE THAT MOST CODE SHOULD BE IN `js/download.js`

  * Cached data should be stored in the extension via indexedDB API - local storage is unacceptable.

  * Sources to cache are in `js/sources.json`

  * All sources should be updated every _downloadFrequencyMinutes_ from `js/sources.json`

  * downloads should be **offset** - if there are 10 sources, only 1 should be downloaded every _downloadFrequencyMinutes_ / 10 == 1 minutes, ex:
    * minute 1:  download source 1
    * minute 2:  download source 2
    * \[...etc...\]
    * minute 10:  download source 10
    * minute 11:  start over and refresh source 1

  * When I display the info popup, I should see:
    * A list of source names
        * each with a timestamp of when last downloaded (this can be the last timestamp when I opened the popup)
        * `Date()` format is fine
        * it doesn't need to update dynamically (if we download while the popup window is open
    * Ex:  **Flickr Public:  Wed Jan 21 2015 21:00:28 GMT-0800 (PST)**