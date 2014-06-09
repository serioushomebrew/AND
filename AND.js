var config      = require('./config.json')

    NNTP        = require('./library/nntp.js'),

    NNTPClient  = new NNTP(config.newsServer);

NNTPClient.updateAll();

// NNTPClient.updateSpots();
// NNTPClient.updateComments();
// NNTPClient.updateReports();