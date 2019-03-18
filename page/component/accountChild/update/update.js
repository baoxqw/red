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
    num: true,
    island: 1,
    mask: false,
    username: '',
    phone: '',
    video: '',
    dates: '2016-11-08',
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
    let formData = JSON.parse(options.JsonData);

    that.setData({
      id: formData.id,
      formData: formData,
      manage: formData.roleName,
      manageid: formData.roleId,
      name: formData.username,
      phone: formData.telphone
    })
    //角色
    wx.request({
      url: u+"/jujube/system/user/roleList",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        let chemicalCategArray = res.data.data;
        that.setData({
          landarray: chemicalCategArray
        })
      }
    })
  },
  //点击角色
  bindPickerChange: function(e) {
    let that = this;
    that.setData({
      island: 2
    })
    //地块下拉框数据请求
    if (that.data.landarray) {
      let manageid = that.data.landarray[e.detail.value].value
      that.setData({
        manageid: manageid,
        landindex: e.detail.value
      })
    } else {
      that.setData({
        landarray: []
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
        num: true,
        phone: e.detail.value
      })
    }
    if (e.detail.value.length > 11) {
      wx.showToast({
        title: '电话有误',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        num: false
      })
    }
  },
  //用户名
  userNameInput: function(e) {
    let that = this;
    let userValue = e.detail.value;
    that.setData({
      name: userValue
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
    wx.request({

      url: u+"/jujube/system/user/roleList",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        let chemicalCategArray = res.data.data;
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

  //提交表单
  formSubmit: function(e) {
    var that = this;
    //用户名
    if (!that.data.name.length || !that.data.manageid || !that.data.phone) {
      wx.showToast({
        title: '将表单填写完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.num) {
      wx.showToast({
        title: '输入正确电话',
        icon: 'none',
        duration: 2000
      })
      return
    }
    //密码
    if (that.data.passwordValue) {
      if (that.data.passwordValue.length < 8) {
        wx.showToast({
          title: '密码长度不够',
          icon: 'none',
          duration: 2000
        })
        return
      }

    }
    //确认密码
    if (that.data.passwordValue && that.data.confirmValue) {
      if (that.data.passwordValue != that.data.confirmValue) {
        wx.showToast({
          title: '两次密码输入不一致',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({
      mask: true
    })

    wx.request({
      url: u+"/jujube/system/user/update",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "id": that.data.id,
        "username": that.data.name,
        "password": "",
        "telphone": that.data.phone,
        "roleName": that.data.manage,
        "roleId": that.data.manageid
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