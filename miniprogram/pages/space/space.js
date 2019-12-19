var app = getApp()
Page({
  data: {
    galleryData: [

    ],
    cursor: 1,
    tips: '载入中...',
    isLoading: false,
    isEnd: false,
    photoWidth: wx.getSystemInfoSync().windowWidth / 5,
    _id: null,
  },
  onLoad() {
    const self = this
    // wx.showLoading({title: '加载中'});

  },
  //调用云函数
  onGetData: function () {
    wx.cloud.callFunction({
      name: getCircle,
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        this.galleryData = res.result.galary
      },
      fail: err => {
        console.log("fail to get gallery data")
      }

    })
  },
  //直接调数据库
  onShow: function () {
    const self = this
    const db = wx.cloud.database()
    db.collection('share').where({
      openID:app.globalData.openid
    }).get({
      success: function (res) {
        self.setData({
          galleryData: res.data
        })
        app.globalData.galleryData = res.data
        console.log(app.globalData.galleryData)
      }
    })
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    })
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.photurl,
      urls: this.data.resource,
    })
  },

  // 删除朋友圈
  delete: function (e) {
    console.log(e)
    const self = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'deleteShare',
      // 传给云函数的参数
      data: {
        _id: e.currentTarget.dataset._id,
      },
      success: function (res) {
        wx.showToast({
          title: '删除成功',
        })
        self.onShow()
      }
    })
  },
})