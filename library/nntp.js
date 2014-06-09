/**
 * TODO - Save the data in the database
 */

var NNTPResource = require('nntp')

    NNTPEngine = new NNTPResource();

function NNTP() {

    // load config
    var config = require('../config.json');

    this.options = {
        host:           config.newsServer.host,
        port:           config.newsServer.port,
        secure:         config.newsServer.secure,
        user:           config.newsServer.user,
        password:       config.newsServer.password,
        connTimeout:    config.newsServer.timeout
    }
    this.connected = false;
}

NNTP.prototype.connect = function(callback) {
    var self = this;

    NNTPEngine.connect({
        host:           this.options.host,
        port:           this.options.port,
        secure:         this.options.secure,
        user:           this.options.user,
        password:       this.options.password,
        connTimeout:    this.options.timeout
    });

    NNTPEngine.on('ready', function() {
        self.connected = true;

        callback();
    });
}

NNTP.prototype.disconnect = function() {
    NNTPEngine.end();
}

NNTP.prototype.updateAll = function(lastSpotNr, lastCommentNr, lastReportNr) {
    var self = this;

    // open connection
    self.connect(function () {

        self.updateSpots(lastSpotNr, function() {
            self.updateComments(lastCommentNr, function() {
                self.updateReports(lastReportNr, function() {
                   console.log('--- DONE WITH UPDATEING ---');
                    NNTPEngine.end();
               });
            });
        });
    });
};

NNTP.prototype.updateSpots = function(lastSpotNr, callback) {
    var self = this;

    // open connection if needed
    if(this.connected === false) {
        self.connect(function() {
            self.updateSpots(lastSpotNr, callback);
        });
    } else {
        scanGroup('free.pt', lastSpotNr, function(err, nr, id, headers, body) {

            console.log('Spot #' + nr);
        }, callback);
    }
}

NNTP.prototype.updateComments = function(lastSpotNr, callback) {
    var self = this;

    // open connection if needed
    if(this.connected === false) {
        self.connect(function() {
            self.updateSpots(lastSpotNr, callback);
        });
    } else {
        scanGroup('free.pt', lastSpotNr, function(err, nr, id, headers, body) {

            console.log('Comment #' + nr);
        }, callback);
    }
}

NNTP.prototype.updateReports = function(lastSpotNr, callback) {
    var self = this;

    // open connection if needed
    if(this.connected === false) {
        self.connect(function() {
            self.updateSpots(lastSpotNr, callback);
        });
    } else {
        scanGroup('free.pt', lastSpotNr, function(err, nr, id, headers, body) {

            console.log('Report #' + nr);
            if (err) console.log(err);
        }, callback);
    }
}


module.exports = NNTP;


// Call listeners
// ERROR
NNTPEngine.on('error', function(error) {
    console.log('Error: ' + error)
});

// CLOSE CONNECTION
NNTPEngine.on('close', function(had_err) {
    console.log('Connection closed');
});

// CONNECTION ENDED
NNTPEngine.on('end', function() {
    console.log('Connection ended');
});


function scanGroup(groupName, lastPosition, articleFunction, callback) {
    NNTPEngine.group(groupName, function(err, count, first, last) {
        if (err) console.log(err);

        if(lastPosition != undefined)
            first = lastPosition;

        console.log('--- GET SPOTS [' + groupName + '] ---');
        console.log('First Article: ' + first);
        console.log('Last Article: ' + last);

        if(first != last) {
            console.log('--- Articles ---');

            getArticles(first, first + 10, articleFunction, callback);
        } else {
            console.log('No new Spots');
        }
    });
}

function getArticles(current, last, articleFunction, callback) {

    if(current < last) {
        NNTPEngine.article(current, function(err, nr, id, headers, body) {
            articleFunction(err, nr, id, headers, body);

            // Call the next article
            getArticles((current + 1), last, articleFunction, callback);
        });
    } else {
        console.log('--- DONE ---');
        callback();
    }
}