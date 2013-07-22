define(['bootbox'], function (bootbox) {
    var messageBox = {
        cancelLabel: '取消',
        okLabel: '确定'
    };

    messageBox.alert = function (msg) {
        bootbox.alert('<p class="text-warning">' + msg + '</p>', this.okLabel);
    };

    messageBox.alert = function (msg, callback) {
        bootbox.alert('<p class="text-warning">' + msg + '</p>', this.okLabel, callback);
    };

    messageBox.info = function (msg) {
        bootbox.alert('<p class="text-info">' + msg + '</p>', this.okLabel);
    };

    messageBox.info = function (msg, callback) {
        bootbox.alert('<p class="text-info">' + msg + '</p>', this.okLabel, callback);
    };

    messageBox.error = function (msg) {
        bootbox.alert('<p class="text-error">' + msg + '</p>', this.okLabel);
    };

    messageBox.error = function (msg, callback) {
        bootbox.alert('<p class="text-error">' + msg + '</p>', this.okLabel, callback);
    };

    messageBox.success = function (msg) {
        bootbox.alert('<p class="text-success">' + msg + '</p>', this.okLabel);
    };

    messageBox.success = function (msg, callback) {
        bootbox.alert('<p class="text-success">' + msg + '</p>', this.okLabel, callback);
    };

    messageBox.confirm = function (msg, callback) {
        bootbox.confirm(msg, this.cancelLabel, this.okLabel, callback);
    };

    return messageBox;
});