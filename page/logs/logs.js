// page/logs/logs.js
var u = getApp().globalData.u;
var util = require('../../util/util.js');
var md5 = require('../../util/md5.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pickerHidden: true,
    chosen: '',
    phone: '',
    password: '',
    username: '',
    showTopTips: false,
    errorMsg: ""

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },
  formSubmit: function(e) {
    // ('form发生了submit事件，携带数据为：', e.detail.value);
    var phone = e.detail.value.phone;
    var password = e.detail.value.password;
    password = md5.hex_md5(password);
    // (password)

    if (!phone.length || !password.length) {
      wx.showToast({
        title: !phone.length ? "手机号码不能为空" : "密码不能为空",
        icon: 'none',
        duration: 1500
      })
      return
    }
     console.log('res')
    // 验证都通过了登录方法
    util.req('/system/login', {
      "username": phone,
      "password": password
    }, function (res) {
      console.log(res)
      if (200 == res.code) {
        // 显示模态弹窗
        getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.sessionId;
        wx.navigateTo({
          url: '../component/index/index'
          //  url: '../component/grow/add/add'
        })
        // wx.showModal({
        //   title: '登录状态',
        //   content: '登录成功，请点击确定吧',
        //   success: function (res) {
        //     if (res.confirm) {
        //       // 点击确定后跳转登录页面并关闭当前页面
        //       wx.navigateTo({
        //         url: '../component/index/index'
        //       })
        //     }
        //   }
        // })
      } else {
        // 显示消息提示框
        var msg = res.msg
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      }
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})