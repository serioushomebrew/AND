var config      = require('./config.json')

    NNTP        = require('./library/nntp.js'),

    NNTPClient  = new NNTP();

NNTPClient.updateAll();

// NNTPClient.updateSpots();
// NNTPClient.updateComments();
// NNTPClient.updateReports();