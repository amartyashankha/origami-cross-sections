importScripts('workbox-sw.prod.v2.0.2-rc1-2.0.2-rc1.0.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "index.html",
    "revision": "d3eeaf734c11eb60f2845eb88e900a15"
  },
  {
    "url": "main.034835d6.js",
    "revision": "6911b6fda6f7779905c497a194474dcb"
  },
  {
    "url": "main.ce6cfd6f.css",
    "revision": "bd61d9293559a2ef89c27ee18b172c69"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
