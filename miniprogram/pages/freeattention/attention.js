const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromID: "",
    toID: "",
    fromName: "",
    toName: "",
    avatarUrl: "",
    isFollow: false,
    followID: ""
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (e) {
    console.log(e)
    const self = this
    self.setData({
      fromID: e.fromID,
      toID: e.toID,
      fromName: e.fromName,
      toName: e.toName,
      avatarUrl: e.avatarUrl
    })

    wx.cloud.callFunction({
      name: "get_id",
      data:{
        fromid: self.data.fromID,
        toid: self.data.toID
      },
      success: res => {
        console.log(res)
        console.log(res.result.data)
        if(res.result.data.length>0){
          self.setData({
            isFollow: true,
            followID: res.result.data[0]._id
          })
        }
      },
      fail: err => {
        console.log("fail to get fans data")
      }
    })
  },
  onShow(){
    this.setData({
      isFollow: !this.data.isFollow
    })
  },
  changeStatus(){
    const self = this
    if(this.data.isFollow){
      wx.cloud.callFunction({
        name: "unfollow",
        data: {
          id: self.data.followID
        },
        success: res => {
          console.log("unfollow success")
          self.onShow()
        },
        fail: err => {
          console.log("unfollow fail")
        }
      })
    }else{
      console.log("follow")
      wx.cloud.callFunction({
        name: "follow",
        data: {
          fromid: self.data.fromID,
          toid: self.data.toID,
          fUser: self.data.fromName,
          tUser: self.data.toName
        },
        success: res => {
          console.log("follow success")
          self.onShow()
        },
        fail: err => {
          console.log("follow fail")
        }
      })
    }
  }
})