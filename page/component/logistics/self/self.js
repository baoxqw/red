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
    username: '',
    phone: '',
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
    dan: '',
    countIndex: 0,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    tihuoWay: '请选择',
    turn: '请选择',
    manage: '请选择',
    bigfarm: '请选择',
    smfarm: '请选择',
    namefarm: '请选择',
    landid: '',
    select: false,
    turnSelect: false,
    addSource: [],
    files: [],
    nofiles: [],
    infos: {},
    selectSource: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
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
    let formData = JSON.parse(options.JsonData);
    that.setData({
      id: formData.id,
      orderstate: formData.orderstate,
      formData: formData,
      dates: formData.createtime.substring(0, 10),
      cityValue: formData.city,
    })
    //根据返回的城市value 显示页面的信息
    let city = that.data.cityValue;
    that.data.placeArray.forEach(function(v1, i1) {
      v1.children.forEach(function(v2, i2) {
        v2.children.forEach(function(v3, i3) {
          if (v3.value == city) {
            that.setData({
              prIndex: i1,
              province: placeArray[i1].label,
              crindex: i2,
              city: placeArray[i1].children[i2].label,
              arIndex: i3,
              area: placeArray[i1].children[i2].children[i3].label
            })
            return;
          }
        })
      })
    })
  },
  //输入框只允许输入数字
  check: function(e) {
    var regNum = new RegExp('[0-9]', 'g'); //判断用户输入的是否为数字
    var rsNum = regNum.exec(e.detail.value);
    if (!rsNum) {
      wx.showToast({
        title: '只允许输入数字',
        icon: 'none',
        duration: 2000
      })
    }
  },
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
  //用户名
  userNameInput: function(e) {
    let that = this;
    let userValue = e.detail.value;
    that.setData({
      userValue: userValue
    })
  },
  //手机号验证
  phoneInput: function(e) {
    let that = this;
    let phoneValue = e.detail.value;
    that.setData({
      phoneValue: phoneValue
    })
    if (phoneValue.length > 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
    }

  },
  //密码验证
  passwordInput: function(e) {
    let that = this;
    let passwordValue = e.detail.value;
    that.setData({
      passwordValue: passwordValue
    })
  },
  //确认密码
  confirmInput: function(e) {
    let that = this;
    let confirmValue = e.detail.value;
    that.setData({
      confirmValue: confirmValue
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },
  //返回订单管理
  go: function() {
    //刷新上一个页面的数据
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 3].onLoad()
    }
    //返回上一级页面 
    wx.navigateBack({
      delta: 2
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
    //
    if (!e.detail.value.name.length || !e.detail.value.address.length || !e.detail.value.person.length) {
      wx.showToast({
        title: '将表单填写完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // id，consignee，finishtime，delivemanager，address，cityStr

    wx.request({
      url: u+"/jujube/deliveSelfget/insert",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "id": that.data.id,
        "finishtime": that.data.dates, //时间
        "consignee  ": e.detail.value.name, //收货人
        "delivemanaer ": e.detail.value.person, //记录人
      }),
      success: function(res) {
        if (res.data.code == 200) {
          //刷新上一个页面的数据
          if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 3].onLoad()
          }

          //返回上一级页面 
          wx.navigateBack({
            delta: 2
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