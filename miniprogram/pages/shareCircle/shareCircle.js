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
    releaseFocus: false,
    text:'',
    star:[]
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
        _id: e.target.dataset._id,
        star:e.target.dataset.star
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
        _id: e.target.dataset._id,
        star: e.target.dataset.star
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

  star:function(){
    const self = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'star',
      // 传给云函数的参数
      data: {
        _id: this.data._id,
        username:this.data.userInfo.nickName
      },
      success: function (res) {
        wx.showToast({
          title: '点赞成功',
        })
        var animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'linear',
          delay: 0,
        })
        self.setData({
          popWidth: 0,
          isShow: true,
        })
        self.onShow()
      },
      fail: console.error
    })
    
  },
  unStar: function () {
    const self = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'unstar',
      // 传给云函数的参数
      data: {
        _id: this.data._id,
        username: this.data.userInfo.nickName
      },
      success: function (res) {
        wx.showToast({
          title: '取消点赞成功',
        })
        var animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'linear',
          delay: 0,
        })
        self.setData({
          popWidth: 0,
          isShow: true,
        })
        self.onShow()
      },
      fail: console.error
    })
  },
  comment:function(){
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0,
    })
    this.setData({
      isShow:true,
      popWidth: 0,
      releaseFocus: true
    })
  },
  bindFormSubmit:function(e){
    console.log(e)
    const self = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'comment',
      // 传给云函数的参数
      data: {
        _id: this.data._id,
        username: this.data.userInfo.nickName,
        comment:e.detail.value.textarea
      },
      success: function (res) {
        wx.showToast({
          title: '评论成功',
        })
        self.setData({
          text: "",
          releaseFocus: false
        })
        self.onShow()
      },
      fail: console.error
    })
  },
  follow:function(e){
    console.log(e)
    wx.redirectTo({
      url: '../freeattention/attention?fromID=' + app.globalData.openid + '&toID=' + e.currentTarget.dataset.item.openID + '&fromName=' + this.data.userInfo.nickName + '&toName=' + e.currentTarget.dataset.item.username + '&avatarUrl=' + e.currentTarget.dataset.item.icon
    })
  }
})