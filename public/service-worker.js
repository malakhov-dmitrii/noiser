import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

// Used for filtering matches based on status code, header, or both
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// Used to limit entries in cache, remove entries after a certain period of time
import { ExpirationPlugin } from 'workbox-expiration';

// Cache page navigations (html) with a Network First strategy
registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ request, url }) => url.includes('mp3'),
  // Use a Network First caching strategy
  new CacheFirst({
    // Put all cached files in a cache named 'pages'
    cacheName: 'sounds',
    plugins: [
      // // Ensure that only requests that result in a 200 status are cached
      // new CacheableResponsePlugin({
      //   statuses: [200],
      // }),
    ],
  })
);
