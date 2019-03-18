// page/component/add/add.js
var app = getApp();
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
var header = getApp().globalData.header;
var u = getApp().globalData.u;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    island:1,
    mask: false,
    productId: '',
    video: '',
    dates: '2016-11-08',
    region: ['陕西省', '西安市', '未央区'],
    sourceTypeIndex: 0,
    sourceType: ['拍照', '相册', '拍照或相册'],
    evalList: [{ tempFilePaths: [], imgList: [] }],
    evalListPaths: [],
    sizeTypeIndex: 0,
    sizeType: ['压缩', '原图', '压缩或原图'],
    pic: [],
    countIndex: 0,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    tihuoWay: '请选择',
    turn: '请选择',
    landid: '',
    select: false,
    turnSelect: false,
    addSource: [],
    files: [],
    infos: {},
    num:'',
    selectSource: [],
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let formData = JSON.parse(options.JsonData);
    that.setData({
      id: formData.id,
      land:formData.name,
      num: formData.num,
      orderid: formData.id,
      productId: formData.productid,

    })
    wx.request({
      url: u+"/jujube/subOrder/getProduct",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function (res) {
        let massifsArray = res.data.data;
        that.setData({ landarray: massifsArray })
      }
    })
  },
  bindPickerChange: function (e) {
    let that = this;
    that.setData({island:2})
    //地块下拉框数据请求
    if (that.data.landarray) {
      let productId = that.data.landarray[e.detail.value].value
      that.setData({
        productId: productId,
        landindex: e.detail.value
      })
    } else {
      that.setData({
        landarray: []
      })
    }

  },
  //输入框只允许输入数字
  check: function (e) {
    var regNum = new RegExp('[0-9]', 'g');//判断用户输入的是否为数字
    var rsNum = regNum.exec(e.detail.value);
    if (!rsNum) {
      wx.showToast({
        title: '只允许输入数字',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
  * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
  */
  videoErrorCallback: function (e) {
  },
  // 商品名称下拉框数据接口
  bindShowMsg() {
    let that = this;
    if (this.data.select == false) {
      this.setData({
        select: true
      })
    } else {
      this.setData({
        select: false
      })
    }
    //商品名称下拉框数据请求
    wx.request({
      url: u+"/jujube/subOrder/getProduct",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function (res) {
        let massifsArray = res.data.data;
    
        let newmassifsArray = [];
        that.setData({ selectSource: massifsArray })
      }
    })
  },
  //商品下拉框是否显示
  mySelect(e) {
    var name = e.currentTarget.dataset.name;
    var productId = e.currentTarget.dataset.id;
    this.setData({
      tihuoWay: name,
      productId: productId,
      select: false
    })
  },
  //提交表单
  formSubmit: function (e) {
    var that = this;
    if (!e.detail.value.num.length || !that.data.productId) {
      wx.showToast({
        title: "请将表单填写完整",
        icon: 'none',
        duration: 1500
      })
      return
    }
    var orderid = wx.getStorageSync('orderid');
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({ mask: true })
    wx.request({
      url: u+"/jujube/subOrder/update",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        id:that.data.id,
        productid: that.data.productId,
        num: e.detail.value.num,
        orderid: that.data.orderid
      }),
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        that.setData({ mask: false })
        // (res.data.data)
        if (res.data.code == 200) {
          // wx.navigateTo({
          //   url: '../list/list'
          // })
          // 刷新上一个页面的数据
          if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 3].onLoad()
          }

          // 返回上一级页面 
          wx.navigateBack({
            delta: 2
          })
        }else{
          wx.showToast({
            title: '服务器错误',
            icon:'none',
            duration:2000
          })
        }
      }
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