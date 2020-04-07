'use strict';

module.exports = function(app) {
    app.use('/sprints', require('./routes/sprints'));
};