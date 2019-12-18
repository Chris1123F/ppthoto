// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const wxContext = cloud.getWXContext()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return db.collection('follow').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        from: event.fromid,
        to: event.toid,
        fromUser: event.fUser,
        toUser: event.tUser
      }
    })
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