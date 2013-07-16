define(['underscore', 'backbone'], function (_, Backbone) {
    return {
        loaderInfo: {
            "loaddata": {
                message: "<p class='text-info'><img src='/img/ajax-loader.gif')/>正在加载数据，请稍候</p>",
                theme: true
            },
            "loadpage": {
                message: "<p class='text-info'><img src='/img/ajax-loader.gif')/>正在加载页面，请稍候</p>",
                theme: true
            },
            "nomessage": {
                message: "<img src='/img/ajax-loader.gif')/>",
                theme: true
            }
        }
    }
});