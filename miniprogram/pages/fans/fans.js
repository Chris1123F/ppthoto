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
  },

  follow(e){
    const self = this
    // let oldData = self.data.fans.slice()
    console.log(e.target.dataset.item)
    // const db = wx.cloud.database()
    if (e.target.dataset.item.isFollowFrom==true){
      // self.data.fans[0].isFollowFrom = false
      console.log("unfollow")
      // const db = wx.cloud.database()
      // db.collection('follow').where({
      //   _id: e.target.dataset.item._id
      // }).update({
      //   data: {
      //     isFollowFrom: false
      //   }
      // })
      wx.cloud.callFunction({
        name: "unfollow",
        data: {
          id: e.target.dataset.item._id
        },
        success: res => {
          console.log("success")
        },
        fail: err => {
          console.log("fail")
        }
      })
    }else{
      console.log("follow")
      console.log(e.target.dataset.item._id)
      wx.cloud.callFunction({
        name: "follow",
        data: {
          id: e.target.dataset.item._id
        },
        success: res => {
          console.log("success")
        },
        fail: err => {
          console.log("fail")
        }
      })
    }

  }

})