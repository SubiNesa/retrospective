module.exports = function(first, ended, admin, options) {
    return first && !ended && admin ? options.inverse(this) : options.fn(this);
};