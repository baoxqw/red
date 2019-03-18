// page/component/select/select.js

var app = getApp();
var store_id = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    selectPerson: true,
    firstPerson: '请选择',//未点选时显示
    selectArea: false,
    stores:[
      {
        id:'001',
        store_name:'今天',
        store_value:'今天内容'
      },
      {
        id: '002',
        store_name: '昨天',
        store_value: '昨天内容'
      },
      {
        id: '001',
        store_name: '明天',
        store_value: '明天内容'
      }
    ]
  },
  mySelect: function (e) {
    this.setData({
      firstPerson: e.target.dataset.me,
      store_id: e.target.dataset.value,
      selectPerson: true,
      selectArea: false,
    })
  },
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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