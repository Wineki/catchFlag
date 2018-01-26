import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'


wx.login({
    success: function () {
      wx.getUserInfo({
        complete: function(){
            new Main()
        },
        fail: function (res) {
          // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
          if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
            // 处理用户拒绝授权的情况
          }
        }
      })
    }
  })
  
wx.authorize({
    scope: 'scope.record',
        fail: function (res) {
        // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
        if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
        // 处理用户拒绝授权的情况
        }    
    }
})