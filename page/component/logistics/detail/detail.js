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
    logisticTime:'2018-9-25',
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
    lists: {},
    add: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let formData = JSON.parse(options.JsonData);
    // 订单信息
    that.setData({
      id:formData.id,
      lists: formData,
      time: formData.createtime.substring(0,10)
    });

    //获取添加权限
    wx.request({
      url: u+"/jujube/system/auth/permissionList",
      header: header, //请求时带上这个请求头
      success: function (res) {
        var permissionList = res.data.data.permissionList;
        // 显示添加
        let poweradd = ["addMessif"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < poweradd.length; j++) {
            if (permissionList[i] == poweradd[j]) {
              that.setData({ add: true });
              break
            }
          }
        }
      }
    });
    //获取子订单信息
    wx.request({
      url: u+"/jujube/subOrder/findChildOrder",
      header: header, //请求时带上这个请求头
      method: 'get',
      data:({
        orderid: that.data.id
      }),
      success: function (res) {
        let orderChild = res.data.data;
        that.setData({ orderChild: orderChild});
      }
    });
    //物流公司配送
    wx.request({
      url: u+"/jujube/subOrder/findDeliveType",
      header: header, //请求时带上这个请求头
      method: 'get',
      data:({
        orderid: that.data.id
      }),
      success: function (res) {
        console.log(res)
        if (res.data.data){
          let orderLogistic = res.data.data[0];
          that.setData({
            orderLogistic: orderLogistic,
            logisticTime: orderLogistic.finishtime.substring(0,10),
            cityValue: orderLogistic.city
          });
          // 三级联动
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
          //根据返回的城市value 显示页面的信息
          let city = orderLogistic.city;
          that.data.placeArray.forEach(function (v1, i1) {
            v1.children.forEach(function (v2, i2) {
              v2.children.forEach(function (v3, i3) {
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
        }
      }
    });


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
  //点击确定或取消
  go: function () {
    //刷新上一个页面的数据
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 2].onLoad()
    }

    //返回上一级页面 
    wx.navigateBack({
      delta: 1
    })
  },
  nogo: function () {
    //刷新上一个页面的数据
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 2].onLoad()
    }

    //返回上一级页面 
    wx.navigateBack({
      delta: 1
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