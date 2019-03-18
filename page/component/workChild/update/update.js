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
var util = require('../../../../util/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: true,
    workarray: [],
    levelarray: [],
    workvalue: 1,
    levelvalue: 1,
    index: 0,
    mask: false,
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
    manageCh: '请选择',
    bigfarm: '请选择',
    smfarm: '请选择',
    namefarm: '请选择',
    landid: '',
    selectman: false,
    selectmanCh: false,
    turnSelect: false,

    addSource: [],
    files: [],
    nofiles: [],
    infos: {},
    selectSource: [],
    selectmanSourceCh: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    var systemTime = util.formatTime(new Date());

    that.setData({
      dates: systemTime
    })
    let formData = JSON.parse(options.JsonData);
    that.setData({
      id: formData.id,
      list: formData,
      dates: formData.childbatchtime.substring(0, 10),
      manageid: formData.processbatchid, //加工批次名称的id
      manage: formData.processBatchName, //加工批次名称的name
      manageCh: formData.levelStr, //批次等级的name
    })
    //根据等级name 匹配等级id
    wx.request({
      url: u+"/jujube/processSubBatch/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        if (res.data.data.levelArray) {
          let source = res.data.data.levelArray;
          source.forEach(function(v) {
            if (v.label == that.data.manageCh) {
              that.setData({
                manageChid: v.value
              })
            }
          })
        }

        // that.setData({ bigselectSource: newchemicalCategArray })
      }
    });
    // 下拉框数据
    wx.request({
      url: u+"/jujube/processSubBatch/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {

        //加工批次名称下拉数据
        let chemicalCategArray = res.data.data.processBatchArray;
        // 等级
        let levelarray = res.data.data.levelArray;
        that.setData({
          workarray: chemicalCategArray,
          levelarray: levelarray
        })
      }
    })
  },
  //输入框只允许输入数字
  check: function(e) {
    let that = this;
    var regNum = new RegExp('^-?\\d+$', 'g'); //判断用户输入的是否为数字
    var rsNum = regNum.test(e.detail.value);
    if (!rsNum) {
      wx.showToast({
        title: '只允许输入数字',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        num: false
      })
    } else {
      that.setData({
        num: true
      })
    }
  },
  // 加工批次名称
  bindPickerChange: function(e) {
    let that = this;
    that.setData({
      workvalue: 2
    });
    // 加工批次名称id
    let manageid = that.data.workarray[e.detail.value].value
    this.setData({
      index: e.detail.value,
      manageid: manageid
    })
  },
  // 等级
  levelbindPickerChange: function(e) {
    let that = this;
    that.setData({
      levelvalue: 2
    });
    // 等级id
    let manageChid = that.data.levelarray[e.detail.value].value
    this.setData({
      index: e.detail.value,
      manageChid: manageChid
    })
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

  // 加工批次名称
  manShowMsg() {
    let that = this;
    if (this.data.selectman == false) {
      this.setData({
        selectman: true
      })
    } else {
      this.setData({
        selectman: false
      })
    }
    wx.request({
      url: u+"/jujube/processSubBatch/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        (res)
        let chemicalCategArray = res.data.data.processBatchArray;
        let newchemicalCategArray = [];
        for (let i = 1; i < chemicalCategArray.length; i++) {
          newchemicalCategArray.push(chemicalCategArray[i])
        }
        that.setData({
          selectmanSource: newchemicalCategArray
        })
        // that.setData({ bigselectSource: newchemicalCategArray })
      }
    })


  },
  manSelect(e) {
    var name = e.currentTarget.dataset.name;
    var manageid = e.currentTarget.dataset.id;
    this.setData({
      manage: name,
      manageid: manageid, //支付id
      selectman: false
    })
  },
  //  加工子批次等级选择
  manShowMsgCh() {
    let that = this;
    if (this.data.selectmanCh == false) {
      this.setData({
        selectmanCh: true
      })
    } else {
      this.setData({
        selectmanCH: false
      })
    }
    wx.request({
      url: u+"/jujube/processSubBatch/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        let childArray = res.data.data.levelArray;
        let newchildArray = [];
        for (let i = 1; i < childArray.length; i++) {
          newchildArray.push(childArray[i])
        }
        that.setData({
          selectmanSourceCh: newchildArray
        })
        // that.setData({ bigselectSource: newchemicalCategArray })
      }
    })


  },
  manSelectCh(e) {
    var name = e.currentTarget.dataset.name;
    var manageChid = e.currentTarget.dataset.id;
    this.setData({
      manageCh: name,
      manageChid: manageChid, //支付id
      selectmanCh: false
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function(e) {
    this.setData({
      dates: e.detail.value
    })
  },
  //提交表单
  formSubmit: function(e) {
    var that = this;
    //用户名
    if (!e.detail.value.childbatchname.length || !e.detail.value.childbatchpackagesize.length ||
      !e.detail.value.childbatchpackageweight.length ||
      !e.detail.value.subprocessername.length) {
      wx.showToast({
        title: '将表单填写完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.num) {
      wx.showToast({
        title: '注意表单格式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.manageid || !that.data.manageChid) {
      wx.showToast({
        title: '将表单填写完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({
      mask: true
    })
    wx.request({
      url: u+"/jujube/processSubBatch/add",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "id": that.data.id,
        "processbatchid": that.data.manageid, //加工子批次名称id
        "childbatchname": e.detail.value.childbatchname, //子批次名称
        "batchlevel": that.data.manageChid, //等级
        "childbatchpackagesize": e.detail.value.childbatchpackagesize, //规格
        "childbatchpackageweight": e.detail.value.childbatchpackageweight, //重量
        "subprocessername": e.detail.value.subprocessername, //操作人
        "childbatchtime": that.data.dates //日期
      }),
      success: function(res) {
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
        } else {
          let err = res.data.msg;
          wx.showToast({
            title: err,
            icon: 'none',
            duration: 3500
          })
        }
      }
    })
    // ()
    // (that.data.manageid);//支付状态
    // (e.detail.value.childbatchname);//农资大类
    // (e.detail.value.subprocessername);//农资类型
    // (e.detail.value.childbatchpackagesize)//农资名称
    // (e.detail.value.childbatchpackageweight)//购买者
    // (e.detail.value.subprocessername);//购买数量
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