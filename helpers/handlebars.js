var register = function (Handlebars) {
    var helpers = {
        if_equals: function (string1, string2, options) {
            if (string1 === string2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        if_equals_ignorecase: function (string1, string2, options) {
            if (string1.toLowerCase() === string2.toLowerCase()) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null); 