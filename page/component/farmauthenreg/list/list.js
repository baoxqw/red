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
    mask: false,
    sure:false,
    next:true,
    num: 0,
    numbered:true,
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
    nofiles: [],
    birthfiles: [],
    nobirthfiles: [],
    infos: {},
    selectSource: [],
    radioItems: [
      { name: '自营销售', value: '1', checked: true  },
      { name: '零售代理', value: '2'},
      { name: '批发代理', value: '3' }

    ],
    address: '',
    shopname: '',
    telphone: '',
    sellername: '',
    idcardnum: '',
    lists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  //三级联动
  changeProvince2: function (e) {
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
  changeCity2: function (e) {
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
  changeArea2: function (e) {
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
  goshow: function () {
    let that = this;
    that.setData({ show: true })
  },
  n: function () {
    let that = this;
    that.setData({ show: false })
  },
  y: function () {
    let that = this;
    that.setData({ show: false });
  },
  //输入框只允许输入数字
  check: function (e) {
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
        numbered: false
      })
    } else {
      that.setData({
        numbered: true
      })
    }
  },
  //上传信用代码图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var data = res.data;
        wx.showLoading({
          title: "上传中..."
        })
        that.setData({
          next: false,
          mask: true,
        })
        wx.uploadFile({
          url: u+'/jujube/file/imageUpload',
          header: header,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            let resp = JSON.parse(res.data)
            if (resp.msg == "上传成功") {
              wx.hideLoading() //完成停止加载
              that.setData({
                next: true,
                mask: false,
              })
              var imgpath = getApp().globalData.imgPath + resp.fileName;
              if (resp.code == 0) {
                that.setData({
                  files: that.data.files.concat(imgpath),
                  nofiles: that.data.nofiles.concat(resp.fileName)
                });
              }
            }
          }
        })
      }

    })
  },
  //删除信用代码图片
  clearImg: function (e) {
    let that = this;
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.files;
    var noevalList = this.data.nofiles;
    evalList.splice(index, 1);
    noevalList.splice(index, 1);
    that.setData({
      files: evalList,
      nofiles: noevalList,
    })
  },
  // previewImage: function (e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  //上传身份证图片
  choosebirthImage: function (e) {
    var that = this;
    if (that.data.birthfiles.length > 1) {
      wx.showToast({
        title: '只能上传两张身份证照片',
        icon: 'none',
        duration: 1500
      })
    } else {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var data = res.data;
        wx.showLoading({
          title: "上传中..."
        })
        that.setData({
          next: false,
          mask: true,
        })
        wx.uploadFile({
          url: u+'/jujube/file/imageUpload',
          header: header,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            let resp = JSON.parse(res.data)
            if (resp.msg == "上传成功") {
              wx.hideLoading() //完成停止加载
              that.setData({
                next: true,
                mask: false,
              })
              var imgpath = getApp().globalData.imgPath + resp.fileName;
              if (resp.code == 0) {
                that.setData({
                  birthfiles: that.data.birthfiles.concat(imgpath),
                  nobirthfiles: that.data.nobirthfiles.concat(resp.fileName)
                });
              }
            }
          }
        })
      }

    })
    }
  },
  //删除身份证图片
  birclearImg: function (e) {
    let that = this;
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.birthfiles;
    var noevalList = this.data.nobirthfiles;
    evalList.splice(index, 1);
    noevalList.splice(index, 1);
    that.setData({
      birthfiles: evalList,
      nobirthfiles: noevalList,
    })
  },
  //单选框事件
  radioChange: function (e) {
    let that = this;
    that.setData({ radioId: e.detail.value });
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
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
    //地块下拉框数据请求
    wx.request({
      url: u+"/jujube/pickRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0'
      }),
      success: function (res) {
        let massifsArray = res.data.data.massifsArray;
        let newmassifsArray = [];
        for (let i = 1; i < massifsArray.length; i++) {
          newmassifsArray.push(massifsArray[i])
        }
        // ('地块下拉列表：');
        // (newmassifsArray)
        that.setData({ selectSource: newmassifsArray })
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
  //提交表单
  formSubmit: function (e) {
    var that = this;
    if (!that.data.next) {
      return
    }
    if (!e.detail.value.shopname.length || !e.detail.value.address.length || !e.detail.value.sellername.length || !that.data.files.length) {
      wx.showToast({
        title: '将表单填写完整！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (that.data.birthfiles.length < 2) {
      wx.showToast({
        title: '请上传身份证正反面照片',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    //验证手机号
  
    // if (!(/^1[34578]\d{9}$/.test(e.detail.value.telphone))) { 
    //   wx.showToast({
    //     title: '手机号有误！',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return;
    // }
    //验证身份证号
    
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(e.detail.value.idcardnum))){
      wx.showToast({
        title: '身份证号有误！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if(!that.data.numbered){
      wx.showToast({
        title: '注意表单格式',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({ mask: true })

    wx.request({
      url: u+"/jujube/register/company/insert",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "isphone": true,
        "comname": e.detail.value.shopname,//企业名称
        "creditcode": e.detail.value.creditcode,//信用代码
        "creditcodepic": that.data.nofiles.join(),//信用代码图片
        "legalperson": e.detail.value.sellername,//负责人姓名
        "idcardnum": e.detail.value.idcardnum,//身份证好
        "idcardnumpic": that.data.nobirthfiles.join(),//身份证照片
        "telphone": e.detail.value.telphone,//电话
        "city": that.data.cityValue,//城市
        "address": e.detail.value.address//地址
      }),
      success: function (res) {
        wx.hideLoading();
        that.setData({ mask: false })
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交表单成功',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            num: 2,
            sure: true,
          })
          wx.navigateTo({
            url: '../../../logs/logs',
          })
          //刷新上一个页面的数据
          // if (getCurrentPages().length != 0) {
          //   getCurrentPages()[getCurrentPages().length - 1].onLoad()
          // }

          //返回上一级页面 
          // wx.navigateBack({
          //   delta: 0
          // })
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

})