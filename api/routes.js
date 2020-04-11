'use strict';

module.exports = function(app, io) {
    app.use('/sprints', require('./routes/sprints')(io));
};