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
    "url": "/index.html",
    "revision": "e1b1bb4c0ed9789a7a116fa001bc3f2e"
  },
  {
    "url": "/main.008becc7.js",
    "revision": "b38b82f3355f315ad5708b8f64e56c7e"
  },
  {
    "url": "/main.ce6cfd6f.css",
    "revision": "7f9fe252f674c44dc4e1f75d6027e01e"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);