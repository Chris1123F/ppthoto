const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans:[],
  },

  onLoad(){
    const self = this;
  //   wx.showLoading({title: '加载中'});
  //   console.log(app.globalData.openid)
  //   wx.cloud.callFunction({
  //     name: "getfans",
  //     data: {
  //       openid: app.globalData.openid
  //     },
  //     success: res => {
  //       console.log(app.globalData.openid)
  //       this.fans = res.result.fans
  //       console.log(this.fans)
  //     },
  //     fail: err => {
  //       console.log("fail to get gallery data")
  //     }

  //   })
  // }
    const db = wx.cloud.database()
    console.log(app.globalData.openid)
    db.collection('follow').where({
      to: app.globalData.openid,
      isFollowTo: true
    }).get({
      success: function (res) {
        console.log(res)
        self.setData({
          fans: res.data
        })
        console.log(self.fans)
      }
    })
  }

})