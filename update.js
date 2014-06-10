/**
 * TODO - Save the data to the database
 */

var config      = require('./config.json')

    NNTP        = require('./library/nntp.js'),

    NNTPClient  = new NNTP(config.newsServer);

NNTPClient.on('ready', function() {

    // Update spots
    NNTPClient.setGroup('free.pt', function(err, count, first, last) {
        NNTPClient.readArticles(first, last, function(err, nr, id, headers, body) {
            console.log('spot #' + nr);
        });
    });

    // Update comments
    NNTPClient.setGroup('free.usenet', function(err, count, first, last) {
        NNTPClient.readArticles(first, last, function(err, nr, id, headers, body) {
            console.log('comment #' + nr);
        });
    });

    // Update reports
    NNTPClient.setGroup('free.willey', function(err, count, first, last) {
        NNTPClient.readArticles(first, last, function(err, nr, id, headers, body) {
            console.log('report #' + nr);
        });
    });

});

NNTPClient.connect();