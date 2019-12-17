const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans: [],
  },

  onLoad() {
    const self = this;
    //获取关注列表
    const db = wx.cloud.database()
    db.collection('follow').where({
      from: app.globalData.openid,
      isFollowFrom: true
    }).get({
      success: function (res) {
        // const count =0
        // res.data.map(ele=>ele.setData({'index':count++}))
        self.setData({
          fans: res.data
        })
      }
    })
  },

  changeState(e) {

    console.log(this.data.fans)
  }




})