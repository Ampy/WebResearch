define([], function () {
    var utils = {
    };

    utils.getValueByProperty = function (item, propertyName) {
        for (var p in item) {
            if (p == propertyName) {
                return item[p];
            }
        }

        return undefined;
    };

    return utils;
});