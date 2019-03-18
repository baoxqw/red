// page/component/add/add.js
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
var header = getApp().globalData.header;
var u = getApp().globalData.u;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAdd: false,
    flies: [],
    video: '',
    dates: '2016-11-08',
    region: ['陕西省', '西安市', '未央区'],
    sourceTypeIndex: 0,
    sourceType: ['拍照', '相册', '拍照或相册'],
    evalList: [{ tempFilePaths: [], imgList: [] }],
    evalListPaths: [],
    sizeTypeIndex: 0,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 0,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    tihuoWay: '请选择',
    turn: '请选择',
    landid: '',
    select: false,
    turnSelect: false,
    addSource: [],
    infos: {},
    files: [],
    selectSource: [],
    formData: {},
    video: '',
    lists:{},
    add:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let formData = JSON.parse(options.JsonData);

    var newturn = [];
    if (formData.turnEntity){
      formData.turnEntity.forEach(function (v) {
        newturn.push(v.label)
      })
     
    }
    that.setData({
      lists: formData,
      turn: newturn,
      });
    //获取添加权限
    wx.request({
      url: u+"/jujube/system/auth/permissionList",
      header: header, //请求时带上这个请求头
      success: function (res) {
        var permissionList = res.data.data.permissionList;

        let poweradd = [ "addMessif"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < poweradd.length; j++) {
            if (permissionList[i] == poweradd[j]) {
              that.setData({ add: true });
             
              break
            }
          }
        }
      }
    })

  },

  // 下拉框
  bindPickerChange: function (e) {
    let val = this.data.array[e.detail.value].value
    this.setData({
      index: e.detail.value
    })
  },
  //是否显示添加种植轮次的遮罩层
  onChangeShowRoundState: function () {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
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
  // 地块下拉框数据接口
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
    // //地块下拉框数据请求
    // wx.request({
    //   url: "http://192.168.1.161:8080/jujube/pickRecord/selectDataSource",
    //   header: header, //请求时带上这个请求头
    //   method: 'get',
    //   data: ({
    //     id: '0'
    //   }),
    //   success: function (res) {
    //     let massifsArray = res.data.data.massifsArray;
    //     let newmassifsArray = [];
    //     for (let i = 1; i < massifsArray.length; i++) {
    //       newmassifsArray.push(massifsArray[i])
    //     }
    //     // ('地块下拉列表：');
    //     // (newmassifsArray)
    //     that.setData({ selectSource: newmassifsArray })
    //   }
    // })
  },
  //地块下拉框是否显示
  mySelect(e) {
    var name = e.currentTarget.dataset.name;
    var landid = e.currentTarget.dataset.id;
    this.setData({
      tihuoWay: name,
      landid: landid,
      select: false
    })
  },
  //轮次下拉框是否显示
  turnSelect(e) {
    var name = e.currentTarget.dataset.name;
    var turnid = e.currentTarget.dataset.id;
    this.setData({
      turn: name,
      turnid: turnid,
      turnSelect: false
    })
  },
  // 轮次下拉框数据接口
  turnShowMsg() {
    let that = this;
    if (this.data.turnSelect == false) {
      this.setData({
        turnSelect: true
      })
    } else {
      this.setData({
        turnSelect: false
      })
    }
    var getLand = that.data.landid;
    //轮次下拉框数据请求
    wx.request({
      url: u+"/jujube/pickRecord/selectMassifChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: getLand
      }),
      success: function (res) {
   
        // (res.data.data)
        let turnList = [];
        turnList = res.data.data;
        that.setData({ turnSource: turnList })
      }
    })
  },
  // 上传图片
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
    
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  //工作地址选择
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {

    this.setData({
      dates: e.detail.value
    })
  },
  //提交表单
  formSubmit: function (e) {
    // (e.detail.value)
    var that = this;
    // (that.data.evalListPaths);

    // (typeof (imgPath));
    // (typeof (that.data.video));
    wx.request({
      url: u+"/jujube/pickRecord/add",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        massifid: that.data.landid,//地块id
        name: e.detail.value.pickName,//采摘批次名称
        pickername: e.detail.value.picker,//采摘负责人
        pickpic: that.data.files.join(),//采摘图片
        picktime: that.data.dates,//采摘时间
        picktotalarea: e.detail.value.pickArea,//采摘总面积
        picktotalweight: e.detail.value.pickWeight,//采摘总重量
        pickvideo: that.data.src,//采摘视频
        turnid: that.data.turnid,//采摘轮次id
        id: that.data.id
      }),
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../list/list'
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