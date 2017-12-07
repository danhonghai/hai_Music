var app = getApp()
var getData = require('../../utils/util')
Page({
  data:{
    text:"这是消息页面，研发中。。。",
    title:"标题",
    userInfo: {},
    message:[],
    animation:{},
    animation_2:{},
    userN:"",
    tap:"tapOff",
    inputValue: "",
    options:{},
    toView:0,
    messageArr:[],
    messageID: 0 
    
  },
  onLoad:function(options){
    var _self = this
    _self.setData({
        title:options.name,
        options:options
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo) {
      //console.log(userInfo)
      _self.setData({
        userInfo:userInfo
      })
    })
  },
  onReady:function(){
    // 页面渲染完成
    var _self = this;
    this.animation = wx.createAnimation();
    this.animation_2 = wx.createAnimation();
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  userNameInput:function(e){
    this.setData({
      userN:e.detail.value
    })
  },
  sendMessage:function(){
  	var that = this;
  	var tmp = Date.parse(new Date());
		tmp = parseInt(tmp/1000) 
    var time_stamp = tmp;
    var nonce_str = getData.getUuid(32, 16);
    var session_id = getData.getUuid(32, 16);
    //console.log(that.data.userN);
    var objchat = {
        "app_id": 1106572472,
        "time_stamp": time_stamp,
        "nonce_str": nonce_str,
        "session": session_id,
        "question": that.data.userN
    }
    objchat.sign = getData.getSign(objchat)
    var sendmsg = {
		"text":that.data.userN,
		"img":that.data.userInfo.avatarUrl,
		"nickName":that.data.userInfo.nickName,
		"me":true
	}
	that.data.messageArr.push(sendmsg)
	that.setData({
		message:that.data.messageArr,
		toView:999999999,
		inputValue:""
	})
    wx.request({
        url: app.globalData.ip+'/fcgi-bin/nlp/nlp_textchat',
        data: objchat,
        method: "GET",
        header: {
            'x-my-custom-header':'some value'
        },
        success: function(res) {
        	if (res.data.ret == 0) {
	            var sendmsg = {
					"text":res.data.data.answer,
					"img":"../../images/icon_register.png",
					"nickName":"福福",
					"me":false
				}
				that.data.messageArr.push(sendmsg)
				that.setData({
					message:that.data.messageArr,
					toView:999999999
				})
        	}else{
        		var sendmsg = {
					"text":"你赢了，这个我不会！",
					"img":"../../images/icon_register.png",
					"nickName":"福福",
					"me":false
				}
				that.data.messageArr.push(sendmsg)
				that.setData({
					message:that.data.messageArr,
					toView:999999999
				})
        	}
        },
        fail:function(err){
            //console.log(err);
        }
    })
  },
  chooseImg:function(){
    var _self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var t = _self.data.message;
        t.push({
          img:_self.data.userInfo.avatarUrl,
          imgList:tempFilePaths,
          me:true
        })
        _self.setData({
          message:t
        })
      }
    })
  },
  getlocat:function(){
    var _self = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        _self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            name: '时代一号',
            desc: '现在的位置'
          }],
          covers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/images/green_tri.png',
            rotate: 10
          }]
        })
        var t = _self.data.message;
          t.push({
            img:_self.data.userInfo.avatarUrl,
            me:true,
            map:true
          })
          _self.setData({
            message:t
          })
    }})
      
  },
  getvoice:function(){
    //console.log("开始录音")
    wx.startRecord({
      success: function(res) {
        //console.log("录音成功")
        var tempFilePath = res.tempFilePath 
      },
      complete:function(res){
        //console.log("complete"+res)
      },
      fail: function(res) {
        //录音失败
        //console.log("fail"+res)
      }
    })
  },
  stopvoice:function(){
    wx.stopRecord()
    //console.log("stop")
  },
  onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '智能机器人陪你聊天',
        path: '/page/wechat',
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
})