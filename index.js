const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const https = require('https');
const staticPath = path.join(__dirname, 'client/build');
const app = express();

env = process.env.NODE_ENV || 'development';

app.disable('x-powered-by');


    if (env === 'production') {
        app.use(forceSsl);
    }


// Serve static files from the React app
app.use(express.static(staticPath, {
    setHeaders: setCustomCacheControl
}));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    console.log(`no match for ${res.req.url}`);
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

//const server = https.createServer({}, app);
const port = process.env.PORT || 3000;
app.listen(port);


console.log(`listening on ${port}`);
console.log(`static path on ${staticPath}`);

function setCustomCacheControl(res, path, stat) {
   // console.log(res.req.url);
    if (res.req.url === '/service-worker.js') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0')
    }
}

function forceSsl(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};