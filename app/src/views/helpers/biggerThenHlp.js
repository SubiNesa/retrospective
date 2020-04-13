module.exports = function(arg1, number, options) {
	return arg1.length > number ? options.fn(this) : options.inverse(this);
};