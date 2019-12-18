// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const wxContext = cloud.getWXContext()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return db.collection('follow').doc(event.id).remove()
  } catch (e) {
    console.error(e)
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}