const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    follows: [],
  },

  onShow() {
    const self = this;
    //获取关注列表
    wx.cloud.callFunction({
      name: "getfollows",
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        console.log(res)
        console.log(res.result.data)
        self.setData({
          follows: res.result.data
        })
      },
      fail: err => {
        console.log("fail to get follows data")
      }
    })
    
  },

  unfollow(e){
    const self = this
    console.log(e.target.dataset.item)
    console.log("unfollow")

    wx.cloud.callFunction({
      name: "unfollow",
      data: {
        id: e.target.dataset.item._id
      },
      success: res => {
        console.log("unfollow success")
        self.onShow()
      },
      fail: err => {
        console.log("unfollow fail")
      }
    })
  }




})