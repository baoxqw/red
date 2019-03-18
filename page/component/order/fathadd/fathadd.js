// page/component/add/add.js
var app = getApp();
var sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
]
var sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
]
var header = getApp().globalData.header;
var u = getApp().globalData.u;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    currentInput: '',
    productId: '',
    video: '',
    dates: '2016-11-08',
    region: ['陕西省', '西安市', '未央区'],
    sourceTypeIndex: 0,
    sourceType: ['拍照', '相册', '拍照或相册'],
    evalList: [{
      tempFilePaths: [],
      imgList: []
    }],
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
    selectSource: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let placeArray = getApp().globalData.placeArray;
    that.setData({
      placeArray: placeArray,
      province: placeArray[0].label,
      pIndex: 0,
      city: placeArray[0].children[0].label,
      cIndex: 0,
      area: placeArray[0].children[0].children[0].label,
      aIndex: 0,
      cityValue: placeArray[0].children[0].children[0].value,
    })
  },
  /**
   * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
   */
  videoErrorCallback: function(e) {},
  //三级联动
  changeProvince2: function(e) {
    let that = this;
    const val = e.detail.value;
    let placeArray = that.data.placeArray;
    // ("e", val)
    this.setData({
      pIndex: val,
      cIndex: 0,
      aIndex: 0,
      cityValue: 0,
      province: placeArray[val].label,
      city: placeArray[val].children[0].label,
      area: placeArray[val].children[0].children[0].label,
      cityValue: placeArray[val].children[0].children[0].value,
    })

  },
  changeCity2: function(e) {
    let that = this;
    let placeArray = that.data.placeArray;
    const val = e.detail.value
    this.setData({
      cIndex: val,
      aIndex: 0,
      cityValue: 0,
      // newcity: placeArray[this.data.pIndex].children[val].label,
      city: placeArray[this.data.pIndex].children[val].children[0].label,
      area: placeArray[this.data.pIndex].children[val].children[0].label,
      cityValue: placeArray[this.data.pIndex].children[val].children[0].value,
    })
  },
  changeArea2: function(e) {
    let that = this;
    let placeArray = that.data.placeArray;
    const val = e.detail.value
    this.setData({
      aIndex: val,
      vIndex: val,
      cityValue: placeArray[this.data.pIndex].children[this.data.cIndex].children[val].value,
      area: placeArray[this.data.pIndex].children[this.data.cIndex].children[val].label
    })
  },
  //显示三级联动
  goshow: function() {
    let that = this;
    that.setData({
      show: true
    })
  },
  n: function() {
    let that = this;
    that.setData({
      show: false
    })
  },
  y: function() {
    let that = this;
    that.setData({
      show: false
    });
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
      success: function(res) {
        let massifsArray = res.data.data;
        // ('商品信息：');
        // (massifsArray);
        let newmassifsArray = [];
        that.setData({
          selectSource: massifsArray
        })
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
  //工作地址选择
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  //文本域输入内容
  getInput: function(e) {
    let that = this;
    this.setData({
      currentInput: e.detail.value
    })

  },

  //提交表单
  formSubmit: function(e) {
    var that = this;

    //表单未填写完  禁止提交
    if (!e.detail.value.num.length || !that.data.region.join().length || !that.data.currentInput.length) {
      wx.showToast({
        title: "请将表单填写完整",
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({
      mask: true
    })
    // (e.detail.value.num);
    // (that.data.region);
    // (that.data.region.join());
    // (e.detail.value.address);
    // (that.data.currentInput)
    wx.request({
      url: u+"/jujube/order/insert",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        name: e.detail.value.num,
        gender: "male",
        notice: false,
        city: that.data.cityValue,
        address: e.detail.value.address,
        description: that.data.currentInput
      }),
      success: function(res) {
        // ('表单提交')
        wx.hideLoading();
        that.setData({
          mask: false
        })
        if (res.data.code == 200) {
          //刷新上一个页面的数据
          if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 2].onLoad()
          }

          //返回上一级页面 
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
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
  onShareAppMessage: function() {

  }
})