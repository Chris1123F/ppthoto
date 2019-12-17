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

    _id:null,
    popTop: 0, //弹出点赞评论框的位置
    popWidth: 0, //弹出框宽度
    isShow: true, //判断是否显示弹出框
  },
  onLoad() {
    const self = this
    // wx.showLoading({title: '加载中'});
    
  },
  onPullDownRefresh: function () {
    const self = this;
    wx.request({
      url: `${app.host}/photo/api/gallery/popular/page/0`,
      success(res) {
        const galleryData = res.data.listData;
        wx.stopPullDownRefresh();
        self.setData({
          tips: '载入中...',
          isLoading: false,
          isEnd: false,
          galleryData,
          cursor: 1
        });
      }
    });
  },
  onReachBottom: function () {
    const self = this;
    let oldList = self.data.galleryData.slice();
    self.setData({
      isLoading: true
    });
    if(!self.data.isEnd){
      wx.request({
        url: `${app.host}/photo/api/gallery/popular/page/${self.data.cursor}`,
        success(res) {
          const galleryData = res.data.listData;
          if (galleryData.length > 0) {
            oldList = oldList.concat(galleryData);
            wx.stopPullDownRefresh();
            self.setData({
              tips: '载入中...',
              galleryData: oldList,
              isLoading: false,
              cursor: self.data.cursor + 1
            });
          } else {
            self.setData({
              tips: '就这些，没了',
              isLoading: true,
              isEnd: true
            });
          }
        }
      });
    }
  },

//调用云函数
  onGetData:function(){
    wx.cloud.callFunction({
      name: getCircle,
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        this.galleryData=res.result.galary
      },
      fail: err=>{
        console.log("fail to get gallery data")
      }

    })
  },
  //直接调数据库
  onShow:function(){
    const self = this
    const db = wx.cloud.database()
    db.collection('share').get({
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
  // 点击了点赞评论
  TouchDiscuss: function (e) {
    // this.data.isShow = !this.data.isShow
    // 动画
    console.log(e)
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0,
    })
    var that = this
    if (that.data.isShow == false) {
      that.setData({
        popTop: e.target.offsetTop - (e.detail.y - e.target.offsetTop) / 2,
        popWidth: 0,
        isShow: true,
        _id: e.target.dataset._id
      })

      // 0.3秒后滑动
      setTimeout(function () {
        animation.width(0).opacity(1).step()
        that.setData({
          animation: animation.export(),
        })
      }, 100)
    } else {
      // 0.3秒后滑动
      setTimeout(function () {
        animation.width(120).opacity(1).step()
        that.setData({
          animation: animation.export(),
        })
      }, 100)

      that.setData({
        popTop: e.target.offsetTop - (e.detail.y - e.target.offsetTop) / 2,
        popWidth: 0,
        isShow: false,
        _id: e.target.dataset._id
      })
    }
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.photurl,
      urls: this.data.resource,
    })
  },

  // 点击点赞的人
  TouchZanUser: function (e) {
    wx.showModal({
      title: e.currentTarget.dataset.name,
      showCancel: false
    })
  },

  // 删除朋友圈
  delete: function () {
    wx.showToast({
      title: '删除成功',
    })
  },

  star:function(){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'star',
      // 传给云函数的参数
      data: {
        _id: this.data._id,
        username:this.data.userInfo.nickName
      },
      success: function (res) {
        console.log(res) // 3
        wx.showToast({
          title: '点赞成功',
        })
      },
      fail: console.error
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0,
    })
    this.setData({
      popWidth: 0,
      isShow: false,
    })
  },
  unStar: function () {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'unstar',
      // 传给云函数的参数
      data: {
        _id: this.data._id,
        username: this.data.userInfo.nickName
      },
      success: function (res) {
        console.log(res) // 3
        wx.showToast({
          title: '取消点赞成功',
        })
      },
      fail: console.error
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0,
    })
    this.setData({
      popWidth: 0,
      isShow: false,
    })
  }
})