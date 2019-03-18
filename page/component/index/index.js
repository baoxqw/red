// page/component/index.js
var util = require('../../../util/util.js');
var header = getApp().globalData.header;
var u = getApp().globalData.u;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    land: false, //地块管理
    agricultural: false, //农资购买记录管理
    farm: false, //农事记录管理
    pick: false, //采摘信息管理
    stock: false, // 库存展示管理
    work: false, //加工批次管理

    workChild: false, //加工子批次管理
    product: false, //产品信息管理
    order: false, //订单管理
    orderChild: false, //子订单管理
    packaged: false, // 包装信息管理
    inform: false, //通知公告管理

    sales: false, //销售回执信息
    logistics: false, //物流信息
    authen: false, //认证信息
    accountChild: false, //子账户管理

    SellerOrder: false, //销售管理员
    trade: false, //销售订单管理
    goout: false, //出入库记录

    farmauthen: false, //种植公司认证
    sellerauthen: false, //销售商认证
    perauthen: false, //个体认证

    farmauthenreg: false, //种植公司认证注册
    sellerauthenreg: false, //销售商认证注册
    perauthenreg: false, //个体认证注册

  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {

    var pick = this.data.pick;
    var that = this;
    wx.request({
      url: u+"/jujube/system/auth/permissionList",
      header: header, //请求时带上这个请求头
      success: function(res) {
        var permissionList = res.data.data.permissionList;
        var role = res.data.data.applyType;
        for (let i in permissionList) {
          if (permissionList[i] === "searchPickInfo") {
            that.setData({
              pick: true
            }); //采摘
          }
          if (permissionList[i] === "searchSellerOrderInfo") {
            that.setData({
              SellerOrder: true
            }); //销售订单
          }
          if (permissionList[i] === "searchMessif") {
            that.setData({
              land: true
            }); //地块
          }
          if (permissionList[i] === "searchPurchase") {
            that.setData({
              agricultural: true
            }); //农资
          }
          if (permissionList[i] === "searchFarmingRecord") {
            that.setData({
              farm: true
            }); //农事
          }
          if (permissionList[i] === "searchWareHouseCount") {
            that.setData({
              stock: true
            }); //库存
          }
          if (permissionList[i] === "searchProcessBatch") {
            that.setData({
              work: true
            }); //加工批次
          }
          if (permissionList[i] === "searchProcessSubBatch") {
            that.setData({
              workChild: true
            }); //加工子批次
          }
          if (permissionList[i] === "searchProductInfo") {
            that.setData({
              product: true
            }); //产品
          }
          if (permissionList[i] === "searchGrowthInfo") {
            that.setData({
              grow: true
            }); //生长
          }
          if (permissionList[i] === "searchOrderInfo") {
            that.setData({
              order: true
            }); //订单
          }

          if (permissionList[i] === "searchPackingInfo") {
            that.setData({
              packaged: true
            }); //包装
          }
          if (permissionList[i] === "searchNoticeInfo") {
            that.setData({
              inform: true
            }); //通知
          }
          if (permissionList[i] === "searchSalesinfo") {
            that.setData({
              sales: true
            }); //销售
          }
          if (permissionList[i] === "searchDeliveInfo") {
            that.setData({
              logistics: true
            }); //物流
          }
          if (permissionList[i] === "addApplyInfo") {
            if (role == 'farmerApply') {
              that.setData({
                perauthen: true
              }); //个体认证
            } else if (role == 'sellerApply') {
              that.setData({
                sellerauthen: true
              }); //销售商认证
            } else if (role == 'farmComApply') {
              that.setData({
                farmauthen: true
              }); //种植公司认证
            } else if (role == 'noApply') {
              that.setData({
                perauthenreg: true
              }); //个体认证注册
              that.setData({
                sellerauthenreg: true
              }); //销售商认证注册
              that.setData({
                farmauthenreg: true
              }); //种植公司认证注册
            }
            // that.setData({ authen: true });//认证
          }
          if (permissionList[i] === "searchUser") {
            that.setData({
              accountChild: true
            }); //子账户
          }
          if (permissionList[i] === "searchWareHouseCount") {
            that.setData({
              goout: true
            }); //出入库记录
          }
        }
      }
    })
    // ('pick:' + this.data.pick)
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