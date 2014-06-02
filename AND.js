var config      = require('./config.json'),

    NNTP        = require('nntp'),

    nntpClient  = new NNTP();



nntpClient.on('ready', function() {
    // Group
    nntpClient.group('misc.test', function(err, count, low, high) {
        console.log('GROUP');
    });

    // Article
    nntpClient.article(function(err, n, id, headers, body) {
        console.log('ARTICLE');
    });

    console.log('Ready');
});

// Error
nntpClient.on('error', function(err) {
    console.log('NNTP Client Error', err);
});

// Close
nntpClient.on('close', function() {
    console.log('NNTP Client Close');
});

// Connect
nntpClient.connect({
    host:       config.newsServer.host,
    port:       config.newsServer.port,
    secure:     config.newsServer.secure,
    user:       config.newsServer.user,
    password:   config.newsServer.password,
    connTimeout:config.newsServer.timeout
});