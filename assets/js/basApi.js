// 每次调用ajax或get或post都会调用此函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url


})