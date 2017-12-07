const util = require('../../utils/util');
const app = getApp();


Page({
	data:{
    
	},
	onLoad:function(options){
		console.log(options)
    	app.getUserInfo(function(userInfo){
    		console.log(userInfo);
    	});
	}
})
