// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = wx.cloud.database()
  const fans = []
  db.collection('follow').aggregate().lookup({
    from: 'user',
    localField: 'from',
    foreignField: 'openID',
    as: 'fansList',
  }).where({
    to: event.openid
    }).get({
      success: function (res) {
        fans = res.result.fansList
      }
    }).end()
  return {
    fans,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}