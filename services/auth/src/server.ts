// Starts auth-service. Tests build the app with createApp() and never import this file.
// SIGTERM: sent by Kubernetes before stopping a pod.
// SIGINT: sent by Ctrl+C during local development.

import {createApp} from './app.js';
import {pool} from './db.js';
import {config} from './config.js';



const app = createApp(pool);


const server = app.listen(config.port, () => {
    console.log(`Auth service listening on port ${config.port}`);

});


function shutdown() {
    server.close(() => {
      void pool.end();
    });
}
 process.on("SIGTERM", shutdown);
 process.on("SIGINT", shutdown);
