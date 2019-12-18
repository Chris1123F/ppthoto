// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const wxContext = cloud.getWXContext()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // var count=db.collection('share').count;
    return db.collection('share').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        comments: [],
        content: event.sendData.formData.desc,
        date: event.sendData.date,
        icon:'',
        openID:'',
        photo:event.sendData.formData.photos,
        shareID:'',
        star:[],
        username:''
      }
    })
  } catch (e) {
    console.error(e)
  }
}