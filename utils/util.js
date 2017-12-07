var app = getApp()
var common = require('../md5')
console.log(common.hexMD5("12312421354"))
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function getMessage(id,obj){
    wx.request({
        url: app.globalData.ip+'/getMsg.php',
        data: {
          id:id
        },
        method: "POST",
        header: {
            'x-my-custom-header':'some value'
        },
        success: function(res) {
            console.log(res)
            obj.setData({
              message:res.data
          })
        },
        fail:function(err){
            console.log(err);
        }
    })
}
function getSign(obj){
    console.log(obj)
    var newkey = Object.keys(obj).sort();
    var newObj = {};
    var strkey = "";
    for (var i = 0; i < newkey.length; i++) {
        if (i+1 == newkey.length) {
            strkey = strkey+newkey[i] +"="+ encodeURIComponent(obj[newkey[i]])
        }else{
            strkey = strkey+newkey[i] +"="+ encodeURIComponent(obj[newkey[i]])+"&"
        }
    }
    strkey = strkey+"&app_key=rxetgw2SF0sGHsxl";
    var strkeyMd5 = common.hexMD5(strkey);
    strkeyMd5 = strkeyMd5.toUpperCase()
    console.log(strkeyMd5)
    return strkeyMd5;
}
//生成UUID
function getUuid(len, radix){
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
     for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
     var r;
     uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
     uuid[14] = '4';
     for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
       r = 0 | Math.random()*16;
       uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
     }
    }
    return uuid.join('');
}

module.exports = {
  formatTime: formatTime,
  getMessage: getMessage,
  getSign: getSign,
  getUuid: getUuid
}