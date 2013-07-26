define(['i18n!nls/localize'],
    function (localize) {
        return {
            getText: function (key) {
                return localize[key];
            }
        }
    }
);