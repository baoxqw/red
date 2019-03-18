// page/component/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView:false,
    showAdd:false,
    lists:[
      {
        'title':'西区大荒地',
        'type':'作物品种',
        'typeName':'阿克苏红枣',
        'num':'种植轮次',
        'numName':'不晓得',
        'local':"地块面积",
        'localNum': '10000m2',
      },
      {
        'title': '西区小荒地',
        'type': '作物品种',
        'typeName': '阿克苏红枣',
        'num': '种植轮次',
        'numName': '不晓得',
        'local': "地块面积",
        'localNum': '10000m2',
      },
      {
        'title': '西区荒地',
        'type': '作物品种',
        'typeName': '阿克苏红枣',
        'num': '种植轮次',
        'numName': '不晓得',
        'local': "地块面积",
        'localNum': '10000m2',
      },
      {
        'title': '西区荒地',
        'type': '作物品种',
        'typeName': '阿克苏红枣',
        'num': '种植轮次',
        'numName': '不晓得',
        'local': "地块面积",
        'localNum': '10000m2',
        'localSize': "测试2面积",
        'localSizeNum': '10000m2',
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({}) ;
    showView: (options.showView == "true" ? true : false)
  },
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  onChangeShowRoundState: function () {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  // 删除 按钮
  yes : function(){
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  no: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 添加轮次 按钮
  roundYes: function () {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  roundNo: function () {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  add: function () {
    wx.navigateTo({
      url: '../add/add'
    })
  },
  update: function () {
    wx.navigateTo({
      url: '../update/update'
    })
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
    wx.hideTabBar({}) 
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