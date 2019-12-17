// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const wxContext = cloud.getWXContext()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  
  console.log("test")
  return await db.collection('follow').doc("b4bbd54c-6c59-4275-b70a-4bac254cfdcf").update({
    data: {
      isFollowFrom: true
    }
  })
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}