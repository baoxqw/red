// page/component/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {
        'url':'../../../image/产品@3x.png',
        'title':'地块管理',
        'bg':'../../../image/bg4@3x.png'
      },
      {
        'url': '../../../image/产品@3x.png',
        'title': '农资购买',
        'bg': '../../../image/bg5@3x.png'
      },
      {
        'url': '../../../image/产品@3x.png',
        'title': '农事记录',
        'bg': '../../../image/bg6@3x.png'
      },
      {
        'url': '../../../image/产品@3x.png',
        'title': '生长记录',
        'bg': '../../../image/bg2@3x.png'
      },
      {
        'url': '../../../image/产品@3x.png',
        'title': '通知公共',
        'bg': '../../../image/bg3@3x.png'
      },
      {
        'url': '../../../image/产品@3x.png',
        'title': '文档管理',
        'bg': '../../../image/bg4@3x.png'
      },
    ]
  },
  golist:function(){
    wx.navigateTo({
      url: '../list/list'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({}) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})