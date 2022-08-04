var crypto = require('crypto');

// 密码盐 (这里自定义保持一致即可)
var salt = "aaaaaaa";

function handler(event) {
    var request = event.request;

    var arrUri = request.uri.split("/");

    var time = arrUri[1];
    var code = arrUri[2];

    // 删除前3个
    arrUri.shift();
    arrUri.shift();
    arrUri.shift();

    var path = arrUri.join("/");

    // MD5 加密
    var md5 = crypto.createHash('md5');
    var result = md5.update(time + path + salt).digest('hex');

    if (code == result) {
        request.uri = '/' + path;
        return request;
    } else {
        return {
            statusCode: 404,
            statusDescription: time + "Not Found" + path,
        }
    }

}



