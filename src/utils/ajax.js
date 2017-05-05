import reqwest from 'reqwest';

!function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
}('ajax', this, function () {

    function ajax(url, params, onSuccess, onComplete, method='POST'){
        console.log("请求的地址是：("+ url +")");
        reqwest({
            url: url,
            type: 'json',
            method: method,
            contentType: "application/x-www-form-urlencoded", //必须用这个格式，否则spring mvc接收不到post参数
            crossDomain: true,                  //跨域
            withCredentials: true,              //跨域时带Cookie
            data: params,
            error: function (err) {
                console.dir('获取数据错误：',err);
                if(typeof onComplete == 'function')
                    onComplete(err);
            },
            success: function (resp) {
                console.dir("获取数据成功：",resp);
                if(typeof onSuccess == 'function')
                    onSuccess(resp);
                if(typeof onComplete == 'function')
                    onComplete(null, resp);
            }
        });
    };

    return ajax;
});