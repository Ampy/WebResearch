define([
    'backbone',
    'underscore'
],
    function (Backbone, _) {
        return {
            fetchTemplate: function (path, done) {
                var JST = window.JST = window.JST || {};
                var def = new $.Deferred();

                // Should be an instant synchronous way of getting the template, if it
                // exists in the JST object.
                if (JST[path]) {
                    if (_.isFunction(done)) {
                        done(JST[path]);
                    }

                    return def.resolve(JST[path]);
                }

                // Fetch it asynchronously if not available from JST, ensure that
                // template requests are never cached and prevent global ajax event
                // handlers from firing.
                $.ajax({
                    url: path,
                    type: "get",
                    dataType: "text",
                    cache: false,
                    global: false,

                    success: function (contents) {
                        JST[path] = _.template(contents);

                        // Set the global JST cache and return the template
                        if (_.isFunction(done)) {
                            done(JST[path]);
                        }

                        // Resolve the template deferred
                        def.resolve(JST[path]);
                    }
                });

                // Ensure a normalized return value (Promise)
                return def.promise();
            }
        }
    }
);