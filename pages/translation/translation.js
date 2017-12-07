const getData = require('../../utils/util');
const app = getApp();


Page({
	data:{
		yimg:null,
		userN:"",
		text:""
	},
	onLoad:function(options){
	    
	},
	bindTextAreaBlur:function(e){
		this.setData({
			userN:e.detail.value
		})
	},
	translation:function(){
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
	        "type": 0,
	        "text": that.data.userN
	    }
	    objchat.sign = getData.getSign(objchat)
	    wx.request({
	        url: app.globalData.ip+'/fcgi-bin/nlp/nlp_texttrans',
	        data: objchat,
	        method: "GET",
	        header: {
	            'x-my-custom-header':'some value'
	        },
	        success: function(res) {
	        	if (res.data.ret == 0) {
		            console.log(res)
		            that.setData({
						text:res.data.data.trans_text
					})
	        	}else{
	        		
	        	}
	        },
	        fail:function(err){
	            //console.log(err);
	        }
	    })
	},
	onShareAppMessage: function (res) {
	    if (res.from === 'button') {
	      // 来自页面内转发按钮
	      console.log(res.target)
	    }
	    return {
	      title: '嗨狗机器人',
	      path: '/page/translation',
	      success: function(res) {
	        // 转发成功
	      },
	      fail: function(res) {
	        // 转发失败
	      }
	    }
	  }
})
