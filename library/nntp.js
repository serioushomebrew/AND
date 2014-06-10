var NNTPResource    = require('nntp')

    EventEmitter    = require('events').EventEmitter,

    util            = require('util'),

    inherits        = util.inherits

    NNTPEngine      = new NNTPResource();


function NNTP(config) {
    this.options = {
        host:           config.host,
        port:           config.port,
        secure:         config.secure,
        user:           config.user,
        password:       config.password,
        connTimeout:    config.timeout
    }
    this.connected = false;
}
inherits(NNTP, EventEmitter);

NNTP.prototype.connect = function() {
    var self = this;

    // Make connection to the server
    NNTPEngine.connect({
        host:           this.options.host,
        port:           this.options.port,
        secure:         this.options.secure,
        user:           this.options.user,
        password:       this.options.password,
        connTimeout:    this.options.timeout
    });

    // Wait till the connection is established, then emit "ready"
    NNTPEngine.on('ready', function() {
        self.connected = true;
        self.emit('ready');
    });
}

NNTP.prototype.setGroup = function(groupName, callback) {
    var self = this;

    // Connect to the group
    NNTPEngine.group(groupName, function(err, count, first, last) {
        callback(err, count, first, last);
    });
}

NNTP.prototype.readArticles = function(current, last, articleFunction, callback) {
    var self = this;

    // Check if we need to stop
    if(current < last) {
        NNTPEngine.article(current, function(err, nr, id, headers, body) {
            articleFunction(err, current, id, headers, body);

            // Call the next article
            self.readArticles((current + 1), last, articleFunction, callback);
        });
    } else {
        callback();
    }
}

NNTP.prototype.disconnect = function() {
    // Close connection with the server
    NNTPEngine.end();

    // If the connection is closed, then emit "close"
    NNTPEngine.on('close', function() {
        self.emit('close');
    });
}


module.exports = NNTP;


// Error listeners
NNTPEngine.on('error', function(error) {
    console.log('Error: ' + error)
});