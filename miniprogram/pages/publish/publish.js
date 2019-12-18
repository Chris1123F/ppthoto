const app = getApp();
Page({
  data: {
    edit:false,
    formData:{
      title:'',
      desc:'',
      photos:[]
    }
  },
  onLoad (option) {
    const self = this;
    
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
        var tempFilePaths = res.tempFilePaths;
        self.setData({
          'formData.photos':self.data.formData.photos.concat(tempFilePaths)
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
      const sendData = { formData, date:new Date(),icon:'',openID:'',username:''};

      //上传到数据库
      console.log(sendData)
      wx.cloud.callFunction({
        name: "publish",
        data: {
          sendData: sendData
        },
        success: res => {
          console.log("publish success")
        },
        fail: err => {
          console.log(err)
        }

      })
      
    }
  }
})