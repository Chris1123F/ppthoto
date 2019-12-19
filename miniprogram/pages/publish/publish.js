const app = getApp();
Page({
  data: {
    openid:'',
    userInfo:{},
    avatarUrl: './user-unlogin.png',

    edit:false,
    formData:{
      title:'',
      desc:'',
      photos:[]
    }
  },
  onLoad (option) {
    const self = this;

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                openid: res.openid
              })
            }
          })
          console.log(this.data.openid)
        } else {

          console.log("fail to auth pub")
        }
      },
      fail: res => {
        console.log("fail to get setting pub")
      }
    })
    
  },
  titleInput(e){
    this.setData({
      'formData.title' : e.detail.value
    });
  },
  descInput(e){
    this.setData({
      'formData.desc': e.detail.value
    });
  },
  //添加图片
  selectPhoto(e){
    const self = this;
    wx.chooseImage({
      count: (9 - self.data.formData.photos.length),
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            self.setData({
              'formData.photos': self.data.formData.photos.concat(res.fileID)
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          }
        })
      }
    })
  },
  //删除图片
  remove(e) {
    var photos = this.data.formData.photos.slice();
    photos.splice(e.currentTarget.dataset.id, 1);
    this.setData({
      'formData.photos': photos
    })
  },
  //提交表单
  formSubmit(e){
    const formData = this.data.formData;
    if (!formData.title || formData.photos.length < 1){
      wx.showModal({
        content: '标题不能为空！照片不能少于1张',
        showCancel:false,
      })
    }else{
      const sendData = { formData, date:new Date(),icon:this.data.avatarUrl,openID:app.globalData.openid,username:this.data.userInfo.nickName};

      //上传到数据库
      console.log(sendData)
      wx.cloud.callFunction({
        name: "publish",
        data: {
          sendData: sendData
        },
        success: res => {
          console.log("publish success")
          wx.switchTab({
            url: '../shareCircle/shareCircle',
          })
        },
        fail: err => {
          console.log(err)
        }

      })
      
    }
  }
})