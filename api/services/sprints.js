
'use strict';

let data = [
	{
		title: 'Sprint 6',
		details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit'
	},
	{
		title: 'Sprint 5',
		details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit'
	}
];
/**
 *  List of sprints
 */    
function list() {
    
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve(data), 500);
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