# PWA Setup

## What is PWA?

Progressive Web Apps (PWAs) are web applications that are regular web pages or websites, but can appear to the user like traditional applications or native mobile applications. The application type attempts to combine features offered by most modern browsers with the benefits of a mobile experience.

## Setup

We're going to build a GPS Tracker.For a simple setup, you'll need following file structure:

- index.html
- manifest.json
- service-worker.js
- style.css

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GPS Tracker PWA</title>
    <link rel="stylesheet" href="./styles.css" />
    <link rel="manifest" href="manifest.json" />
    <link rel="shortcut icon" href="/icons/fire (1).png" type="image/png" />
  </head>
  <body>
    <h1>GPS Tracker</h1>
    <div class="buttons">
      <button id="startButton">Start Tracking</button>
      <button id="stopButton">Stop Tracking</button>
    </div>
    <div class="data"><pre id="log">GPS data will appear here...</pre></div>

    <script src="app.js"></script>
    <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/service-worker.js").then(
            function (registration) {
              // Registration was successful
              console.log(
                "ServiceWorker registration successful with scope: ",
                registration.scope
              );
            },
            function (err) {
              // registration failed :(
              console.log("ServiceWorker registration failed: ", err);
            }
          );
        });
      }
    </script>
  </body>
</html>
```

- The `manifest.json` file is a simple JSON file that tells the browser about your web application and how it should behave when 'installed' on the user's mobile device or desktop.
- The `service-worker.js` file is a JavaScript file that runs in the background of your web app. It's responsible for caching the app shell and handling push notifications.

### manifest.json

```json
{
  "short_name": "GPS Tracker",
  "name": "Simple GPS Tracker",
  "icons": [
    {
      "src": "./icons/fire.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "index.html",
  "display": "fullscreen",
  "background_color": "#FFFFFF",
  "theme_color": "#000000"
}
```

### service-worker.js

```javascript
// This is the "Offline page" service worker

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const CACHE = "gpslogger-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
```

- The `service-worker.js` file is a JavaScript file that runs in the background of your web app. It's responsible for caching the app shell and handling push notifications.

Let's quickly go through the code:

```javascript
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
```

- This line imports the Workbox library, which is a set of libraries and Node modules that make it easy to cache assets and take full advantage of features used to build Progressive Web Apps.

```javascript
const CACHE = "gpslogger-page";
```

- This line defines the name of the cache.

```javascript
const offlineFallbackPage = "index.html";
```

- This line defines the offline fallback page.

```javascript
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
```

- This code listens for a message from the client and skips the waiting state. This is useful when you want to update the service worker and activate it immediately. Skipping the waiting state ensures that the new service worker is activated immediately.

```javascript
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
  );
});
```

- This code listens for the install event and caches the offline fallback page. This is the page that will be displayed when the user is offline.

```javascript
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}
```

- This code checks if the navigation preload feature is supported and enables it. Navigation preload is a feature that allows the service worker to start fetching resources before the page is loaded.

```javascript
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
```

- This code listens for the fetch event and responds with the offline fallback page when the user is offline. This ensures that the user always has something to see when they are offline.

## Deploy

To make this a PWA, you need to deploy it on a server. You can use GitHub Pages, Netlify, or any other hosting service. It has to be served over HTTPS to work as a PWA. Once you deploy it, you can access it on your mobile device or desktop browser. You'll see an option to install the app on your device.
