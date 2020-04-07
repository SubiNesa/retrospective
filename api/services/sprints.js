
'use strict';

/**
 *  List of sprints
 */    
function list() {
    
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve("done!"), 1000);
	});
};

/**
 * One sprint
 * @param id
 */    
function one(id) {
    
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve("done!"), 1000);
	});
};

/**
 * Save new sprint
 */    
function save() {
    
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve("done!"), 1000);
	});
};

/**
 * Update sprint
 * @param id
 */    
function update(id) {
    
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve("done!"), 1000);
	});
};

module.exports = {
	list,
	one,
	save,
	update
};