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
var key = getApp().globalData.key;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: true,
    isbig: 1,
    ispay: 1,
    istype: 1,
    isname: 1,
    mask: false,
    next: true,
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

    landid: '',
    select: false,
    turnSelect: false,
    addSource: [],
    files: [],
    nofiles: [],
    infos: {},
    selectSource: [],
    currentInput: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let formData = JSON.parse(options.JsonData);
    that.setData({
      key: true
    })
    that.setData({
      formData: formData,
      id: formData.id,
      dates: formData.purchasetime.substring(0, 10),
      currentInput: formData.common,
      pay: formData.payMoneyState, //支付状态
      manageid: formData.paystate,
      operatorid: formData.operatorid,
      isdel: formData.isdel,
      namefarmid: formData.pesticidesid,
    })
    //调取页面数据
    wx.request({
      url: u+"/jujube/register/purchase/findById",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: formData.id
      }),
      success: function(res) {
        var source = res.data.data;
        if (source.pesticidesid) {
          that.setData({
            namefarmid: source.pesticidesid, //农资名称id
          })
        }

        if (source.chemicalcategorId) {
          that.setData({
            bigfarmid: source.chemicalcategorId, //农资大类的id
            bigfarm: source.chemicalcategorvalue, //农资大类的name
          })
          //农资类型
          wx.request({
            url: u+"/jujube/register/catalog/getCaltypyByCategor",
            header: header, //请求时带上这个请求头
            method: 'post',
            data: ({
              "chemicalcategorId": source.chemicalcategorId,
            }),
            success: function(res) {

              let chemicalTypeArray = res.data.data;
              let newo = {
                label: '请选择',
                value: 0,
              }
              chemicalTypeArray.unshift(newo)
              that.setData({
                typearray: chemicalTypeArray
              })

            }
          })
        }
        if (source.chemicaltypyId) {
          that.setData({
            smfarmid: source.chemicaltypyId, //农资类型的id
            smfarm: source.chemicaltypyvalue, //农资类型的name
          })
          //农资名称
          wx.request({
            url: u+"/jujube/register/purchase/findName",
            header: header, //请求时带上这个请求头
            method: 'post',
            data: ({
              "chemicalcategorId": source.chemicalcategorId,
              "chemicaltypyId": source.chemicaltypyId,
            }),
            success: function(res) {
              let chemicalArray = res.data.data;
              that.setData({
                namearray: chemicalArray,
                namefarmid: chemicalArray[0].value
              })
            }
          })
        }

      }
    })
    //获取农资名称name
    if (that.data.namefarmid) {
      wx.request({
        url: u+"/jujube/register/catalog/getPesticides",
        header: header, //请求时带上这个请求头
        method: 'POST',
        data: ({
          pesticidesId: that.data.namefarmid
        }),
        success: function(res) {
          let source = res.data.data;
          source.forEach(function(v) {
            if (v.value == that.data.namefarmid) {
              that.setData({
                namefarm: v.label
              })
              return;
            }
          })
        }
      })
    }
    //支付状态
    let newmanagetypeArray = [{
        "label": "请选择",
        "value": 0
      },
      {
        "label": "已支付",
        "value": 1
      },
      {
        "label": "未支付",
        "value": 2
      }
    ]
    that.setData({
      statearray: newmanagetypeArray
    })
    //农资大类
    wx.request({
      url: u+"/jujube/register/catalog/getCategor",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({

      }),
      success: function(res) {
        (res)
        let chemicalCategArray = res.data.data;
        let newc = {
          label: '请选择',
          value: 0,
        }
        chemicalCategArray.unshift(newc)
        that.setData({
          bigarray: chemicalCategArray
        })
      }
    })



  },
  //点击支付状态
  statebindPickerChange: function(e) {
    let that = this;
    that.setData({
      ispay: 2
    })
    //地块下拉框数据请求
    if (that.data.statearray) {
      let manageid = that.data.statearray[e.detail.value].value
      that.setData({
        manageid: manageid,
        stateindex: e.detail.value
      })
    } else {
      that.setData({
        statearray: []
      })
    }

  },
  //点击农资大类
  bigbindPickerChange: function(e) {
    let that = this;
    that.setData({
      istype: 2,
      isname: 2
    })
    //地块下拉框数据请求
    if (that.data.bigarray) {
      let bigfarmid = that.data.bigarray[e.detail.value].value
      that.setData({
        bigfarmid: bigfarmid,
        bigindex: e.detail.value,
        typearray: [],
        typeindex: 0,
        namearray: [],
        nameindex: 0,
      })
    } else {
      that.setData({
        bigarray: []
      })
    }
    //农资类型的数据
    wx.request({
      url: u+"/jujube/register/catalog/getCaltypyByCategor",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "chemicalcategorId": that.data.bigfarmid,
      }),
      success: function(res) {

        let chemicalTypeArray = res.data.data;
        let newo = {
          label: '请选择',
          value: 0,
        }
        chemicalTypeArray.unshift(newo)
        that.setData({
          typearray: chemicalTypeArray
        })
      }
    })
  },
  //点击农资类型
  typebindPickerChange: function(e) {
    let that = this;
    that.setData({
      istype: 2,
      isname: 2
    })
    //地块下拉框数据请求
    if (that.data.typearray.length > 0) {
      let smfarmid = that.data.typearray[e.detail.value].value
      that.setData({
        smfarmid: smfarmid,
        typeindex: e.detail.value,
        namearray: [],
        nameindex: 0,
      })
    } else {
      that.setData({
        typearray: []
      })
    }
    //农资名称
    wx.request({
      url: u+"/jujube/register/purchase/findName",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "chemicalcategorId": that.data.bigfarmid,
        "chemicaltypyId": that.data.smfarmid,
      }),
      success: function(res) {
        let chemicalArray = res.data.data;
        that.setData({
          namearray: chemicalArray,
          namefarmid: chemicalArray[0].value
        })
      }
    })

  },
  //点击农资名称
  namebindPickerChange: function(e) {
    let that = this;
    that.setData({
      isname: 2
    })
    //地块下拉框数据请求
    if (that.data.namearray.length > 0) {
      let namefarmid = that.data.namearray[e.detail.value].value
      that.setData({
        namefarmid: namefarmid,
        nameindex: e.detail.value
      })
    } else {
      that.setData({
        namearray: []
      })
    }

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
  // 支付状态
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
    let newmanagetypeArray = [{
        "label": "已支付",
        "value": 1
      },
      {
        "label": "未支付",
        "value": 2
      }
    ]
    that.setData({
      selectmanSource: newmanagetypeArray
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
  //农资大类下拉框数据接口
  bigShowMsg() {
    let that = this;
    that.setData({
      smfarm: '请选择',
      namefarm: '请选择'
    })
    if (this.data.bigselect == false) {
      this.setData({
        bigselect: true
      })
    } else {
      this.setData({
        bigselect: false
      })
    }
    //农资大类下拉框数据请求
    wx.request({
      url: u+"/jujube/register/catalog/getCategor",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({

      }),
      success: function(res) {

        let chemicalCategArray = res.data.data;
        that.setData({
          bigselectSource: chemicalCategArray
        })
      }
    })
  },

  //农资大类下拉框是否显示
  bigSelect(e) {
    var name = e.currentTarget.dataset.name;
    var bigfarm = e.currentTarget.dataset.id;

    this.setData({
      bigfarm: name,
      bigfarmid: bigfarm, //农资大类id
      bigselect: false
    })
  },
  //农资小类
  smShowMsg() {
    let that = this;
    that.setData({
      namefarm: '请选择'
    })
    if (this.data.smselect == false) {
      this.setData({
        smselect: true
      })
    } else {
      this.setData({
        smselect: false
      })
    }
    //农资小类下拉框数据请求
    wx.request({
      url: u+"/jujube/register/catalog/getCaltypyByCategor",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "chemicalcategorId": that.data.bigfarmid,
      }),
      success: function(res) {

        let chemicalTypeArray = res.data.data;
        that.setData({
          smselectSource: chemicalTypeArray
        })
      }
    })
  },
  //农资小类下拉框是否显示
  smSelect(e) {
    var name = e.currentTarget.dataset.name;
    var smfarmid = e.currentTarget.dataset.id;
    this.setData({
      smfarm: name,
      smfarmid: smfarmid, //农资类型id
      smselect: false
    })
  },
  //农资名称
  nameShowMsg() {
    let that = this;
    if (this.data.nameselect == false) {
      this.setData({
        nameselect: true
      })
    } else {
      this.setData({
        nameselect: false
      })
    }
    //农资名称下拉框数据请求
    wx.request({
      url: u+"/jujube/register/purchase/findName",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "chemicalcategorId": that.data.bigfarmid,
        "chemicaltypyId": that.data.smfarmid,

      }),
      success: function(res) {
        let chemicalArray = res.data.data;
        that.setData({
          nameselectSource: chemicalArray
        })
      }
    })
  },
  //农资名称下拉框是否显示
  nameSelect(e) {
    let that = this;
    var name = e.currentTarget.dataset.name;
    var namefarmid = e.currentTarget.dataset.id;
    this.setData({
      namefarm: name,
      namefarmid: namefarmid, //农资名称id
      nameselect: false
    })
  },
  //文本域输入内容
  getInput: function(e) {
    let that = this;
    this.setData({
      currentInput: e.detail.value
    })
  },
  //工作地址选择
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function(e) {
    (e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  //提交表单
  formSubmit: function(e) {
    var that = this;
    if (!e.detail.value.user.length || !e.detail.value.usenum.length || !e.detail.value.usesum.length) {
      wx.showToast({
        title: "请将表单填写完整",
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (!that.data.namefarmid || !that.data.smfarmid || !that.data.bigfarmid || !that.data.manageid) {
      wx.showToast({
        title: "请将表单填写完整",
        icon: 'none',
        duration: 1500
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
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({
      mask: true
    })

    wx.request({
      url: u+"/jujube/register/purchase/update",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "id": that.data.id,
        "pesticidesid": that.data.namefarmid, //农资名称id
        "purchasetime": that.data.dates, //日期
        "paystate": that.data.manageid, //支付id
        "purchasecredit": e.detail.value.user,
        "num": e.detail.value.usenum,
        "price": e.detail.value.usesum,
        "common": that.data.currentInput,
        "chemicalcategorId": that.data.bigfarmid, //农资大类id
        "chemicaltypyId": that.data.smfarmid, //农资类型id
        "chemicalcategorvalue": that.data.bigfarm, //农资大类name
        "chemicaltypyvalue": that.data.smfarm, //农资类型name
        "operatorid": that.data.operatorid,
        "isdel": that.data.isdel,
      }),
      success: function(res) {

        wx.hideLoading();
        that.setData({
          mask: false
        })
        if (res.data.code == 200) {
          if (getCurrentPages().length != 0) {
            (getCurrentPages())
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 2].onLoad()
          }
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

    // wx.setStorageSync('turnName', that.data.turn);
    // wx.setStorageSync('landName', that.data.tihuoWay);
    // ()
    // (that.data.manageid);//支付状态
    // (that.data.bigfarmid);//农资大类
    // (that.data.smfarmid);//农资类型
    // (that.data.namefarmid)//农资名称
    // (e.detail.value.user)//购买者
    // (e.detail.value.usenum);//购买数量
    // (e.detail.value.usesum);//购买总价
    // (that.data.dates)//时间
    // (that.data.currentInput)//备注



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

})