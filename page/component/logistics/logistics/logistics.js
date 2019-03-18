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
    radioItems: [
      { name: '物流公司配送', value: '0',checked: true},
      { name: '自主配送', value: '1', },
      { name: '自提配送', value: '2', }
    ],
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
    logisticTime: '2018-9-25',
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
    that.setData({
      id: formData.id,
      lists: formData,
      time: formData.createtime.substring(0, 10)
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
      data: ({
        orderid: that.data.id
      }),
      success: function (res) {
        let orderChild = res.data.data;
        that.setData({ orderChild: orderChild });
      }
    });
    //物流公司配送
    wx.request({
      url: u+"/jujube/subOrder/findDeliveType",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        orderid: that.data.id
      }),
      success: function (res) {
        if (res.data.data) {
          let orderLogistic = res.data.data[0];
          that.setData({
            orderLogistic: orderLogistic,
            logisticTime: orderLogistic.finishtime
          });
        }
      }
    });

  },
  //单选框
  radioChange: function (e) {
    var radioValue = e.detail.value;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioValue: radioValue,
      radioItems: radioItems
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
  go: function (e) {
    let that = this;
    let data = e.currentTarget.dataset.data
    let radioItems = that.data.radioItems;
    if (radioItems[0].checked == true){
      wx.navigateTo({
        url: `../company/company?JsonData=${JSON.stringify(data)}`
      })
    }
    if (radioItems[1].checked == true) {
      wx.navigateTo({
        url: `../own/own?JsonData=${JSON.stringify(data)}`
      })
    }
    if (radioItems[2].checked == true) {
      wx.navigateTo({
        url: `../self/self?JsonData=${JSON.stringify(data)}`
      })
    }
    
    
  },
  nogo:function(){
    //刷新上一个页面的数据
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 2].onLoad()
    }

    //返回上一级页面 
    wx.navigateBack({
      delta: 1
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  // upLoadImg: function (list) {
  //   var that = this;
  //   this.upload(that, list);
  // },
  //删除图片
  clearImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.evalList;
    var evalListPaths = this.data.evalListPaths;
    var img = evalList[0].tempFilePaths;
    img.splice(index, 1);
    evalListPaths.splice(index, 1)
    this.setData({
      evalList: evalList,
      evalListPaths: evalListPaths
    })
    // this.upLoadImg(img);
  },
  //上传视频
  geted: function () {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60, //拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: ['front', 'back'],//前置或者后置摄像头，默认为前后都有，即：['front', 'back']
      success: function (res) {
        that.setData({
          src: res.tempFilePath,
          video: res.tempFilePath
        })
      }
    })

  },

  /**
  * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
  */
  videoErrorCallback: function (e) {

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