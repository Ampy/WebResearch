/*!
 * jQuery Browser Support - v1.0.0 - 16.01.2013
 * https://github.com/SerafimArts/jquery.browser.js
 * Copyright 2013 Serafim Arts, Inc. and other contributors; Licensed MIT
 */

if (parseFloat(/[0-9]\.[0-9]/.exec($.fn.jquery)[0]) >= 1.9) {
    (function (jQuery) {
        jQuery.uaMatch = function (ua) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
				[];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        };

        matched = jQuery.uaMatch(navigator.userAgent);
        browser = {};

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        /*/ Chrome is Webkit, but Webkit is also Safari. */
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }
        jQuery.browser = browser;
    })(jQuery);
}