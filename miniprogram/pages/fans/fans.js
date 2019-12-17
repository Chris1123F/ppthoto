const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans:[],
    follows:[],
    tempID: ""
  },

  onShow(){
    const self = this;
  //   wx.showLoading({title: '加载中'});
    console.log(app.globalData.openid)
    wx.cloud.callFunction({
      name: "getfans",
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        console.log(res)
        console.log(res.result.data)
        self.setData({
          fans: res.result.data
        })
      },
      fail: err => {
        console.log("fail to get fans data")
      }
    })
    wx.cloud.callFunction({
      name: "getfollows",
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        var tmp = []
        for (var index in res.result.data) {
          tmp.push(res.result.data[index].toUser)
          console.log(res.result.data[index].toUser)
        }
        self.setData({
          follows: tmp
        })
        console.log(this.data.follows)
      },
      fail: err => {
        console.log("fail to get follows data")
      }
    })
  },
  //   const db = wx.cloud.database()
  //   console.log(app.globalData.openid)
  //   const res = db.collection('follow').where({
  //     to: app.globalData.openid,
  //   }).get()

  //   console.log(res)
  //   console.log(res.PromiseValue.data)

  //   for(var index in res.data){
  //     fans: res.data[index].fromUser
  //   }

  //   db.collection('follow').where({
  //     from: app.globalData.openid,
  //   }).get({
  //     success: function (res) {
  //       console.log(res)
  //       self.setData({
  //         follows: res.data
  //       })
  //     }
  //   })
  // },

  follow(e){
    const self = this
    // let oldData = self.data.fans.slice()
    console.log(e.target.dataset.item)

    
    if (self.data.follows.indexOf(e.target.dataset.item.fromUser)>-1){
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
      console.log(e.target.dataset.item.from)
      //得到主键
      wx.cloud.callFunction({
        name: "get_id",
        data: {
          toid: e.target.dataset.item.from,
          fromid: e.target.dataset.item.to
        },
        success: res => {
          var temp = res.result.data[0]._id
          // self.setData({
          //   tempID : tmp
          // })
          wx.cloud.callFunction({
            name: "unfollow",
            data: {
              id: temp
            },
            success: res => {
              console.log("success")
            },
            fail: err => {
              console.log("fail")
            }
          })
        },
        fail: err => {
          console.log("get_id fail")
        }
      })
      console.log(this.data.tempID)
      
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