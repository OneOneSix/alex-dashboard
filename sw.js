/* Lets the dashboard open with no signal.

   Network-first on purpose: it always tries the live version first, and only
   falls back to the saved copy when there's no connection. That means editing
   the calendar always shows up straight away — a cache-first worker would keep
   serving last month until someone cleared it. */

var CACHE = "alex-v1";
var FILES = [
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(FILES); })
      .then(function(){ return self.skipWaiting(); })
      .catch(function(){ /* first load offline; nothing to save yet */ })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys()
      .then(function(keys){
        return Promise.all(keys.map(function(k){
          if (k !== CACHE) return caches.delete(k);
        }));
      })
      .then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if (req.method !== "GET") return;

  // Never cache the weather — a stale temperature is worse than none.
  if (req.url.indexOf("open-meteo.com") !== -1) return;

  e.respondWith(
    fetch(req)
      .then(function(res){
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      })
      .catch(function(){
        return caches.match(req).then(function(hit){
          return hit || caches.match("./index.html");
        });
      })
  );
});
