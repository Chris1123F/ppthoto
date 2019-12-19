// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const wxContext = cloud.getWXContext()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const count=db.collection('share').count();
    return db.collection('share').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        comments: [],
        content: event.sendData.formData.desc,
        date: event.sendData.date,
        icon:event.sendData.icon,
        openID:event.sendData.openID,
        photo:event.sendData.formData.photos,
        shareID:JSON.stringify(count+1),
        star:[],
        username:event.sendData.username
      }
    })
  } catch (e) {
    console.error(e)
  }
}