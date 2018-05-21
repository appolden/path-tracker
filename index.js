const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
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

// pre render pages to make them SEO friendly
//app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN));


app.get('/en/gr10/map', (req, res) => {
    console.log(`user agent is ${req.headers['user-agent']}`);
    if (isUserAgentCrawler(req.headers['user-agent'])) {
        console.log(`crawler detected returning snapshot`);
        res.sendFile(path.join(__dirname + '/snapshots/en/gr10/map.htm'));
    }
    else {
        res.sendFile(path.join(__dirname + '/client/build/index.html'));
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    console.log(`no match for ${res.req.url}`);
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port);


console.log(`listening on ${port}`);
console.log(`static path on ${staticPath}`);

function setCustomCacheControl(res, path, stat) {
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


const crawlerUserAgents = ['facebookexternalhit/1.1', 'Twitterbot/1.0', 'Mozilla/5.0 (compatible; Twitterbot/1.0)', 'Mozilla/5.0 (Twitterbot/0.1)'];

function isUserAgentCrawler(userAgent) {
    var found = crawlerUserAgents.find(function (crawlerUserAgent) {
        return userAgent.indexOf(crawlerUserAgent) > -1;
    });

    return found !== undefined;
}
