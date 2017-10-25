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
    "revision": "fdc5bfe188e5399fe034fe6757e6a748"
  },
  {
    "url": "/main.a0db8e36.js",
    "revision": "1fe69a01c9f97c281f8f37f587d092c8"
  },
  {
    "url": "/main.ce6cfd6f.css",
    "revision": "d8f78a16220ccf12eb28ba4d3a55d059"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
