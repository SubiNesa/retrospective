'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    SprintSchema = new Schema({
		title: String,
        details: String,
		creator:  String,
		ended: Date,
		start: Array,
		continue: Array,
		stop: Array,
        updated: {
            type: Date,
            default: Date.now
        },
        created: {
            type: Date,
            default: Date.now
        }
    });

SprintSchema.methods.toJSON = function() {
    return this.toObject();
}

module.exports = mongoose.model('Sprint', SprintSchema);