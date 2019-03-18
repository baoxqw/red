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
    istype: 1,
    mask: false,
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
    salesType: '请选择',
    turn: '请选择',
    landid: '',
    select: false,
    selectSales: false,
    turnSelect: false,
    addSource: [],
    files: [],
    infos: {},
    selectSource: [],
    selectSales: []

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
      tihuoWay: formData.productName,
      land: formData.productName,
      salesType: formData.salesTypeStr,
      typed: formData.salesTypeStr,
      dates: formData.salestime.substring(0, 10),
      numm: formData.sum,
      address: formData.address,
      productId: formData.productid,
      salesId: formData.salestype,
      id: formData.id,
      cityValue: formData.city,
    });
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
    //产品名称
    wx.request({
      url: u+"/jujube/salesinfo/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        let massifsArray = res.data.data.productArray;
        that.setData({
          landarray: massifsArray
        })
      }
    })
    //销售类型
    wx.request({
      url: u+"/jujube/salesinfo/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        let salesArray = res.data.data.salestypeArray;
        that.setData({
          typearray: salesArray
        })
      }
    })
  },
  //点击产品名称
  bindPickerChange: function(e) {
    let that = this;
    that.setData({
      island: 2
    })
    // 加工批次名称id
    let productId = that.data.landarray[e.detail.value].value
    this.setData({
      landindex: e.detail.value,
      productId: productId
    })
  },
  //点击销售类型
  typebindPickerChange: function(e) {
    let that = this;
    that.setData({
      istype: 2
    })
    let salesId = that.data.typearray[e.detail.value].value
    this.setData({
      typeindex: e.detail.value,
      salesId: salesId
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
  /**
   * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
   */
  videoErrorCallback: function(e) {

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
      url: u+"/jujube/salesinfo/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {

        let massifsArray = res.data.data.productArray;
        let newmassifsArray = [];
        for (let i = 1; i < massifsArray.length; i++) {
          newmassifsArray.push(massifsArray[i])
        }
        that.setData({
          selectSource: newmassifsArray
        })
      }
    })
  },
  // 商品名称下拉框数据接口
  bindShowSalesMsg() {
    let that = this;
    if (this.data.selectSales == false) {
      this.setData({
        selectSales: true
      })
    } else {
      this.setData({
        selectSales: false
      })
    }
    //销售类型下拉框数据请求
    wx.request({
      url: u+"/jujube/salesinfo/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({

      }),
      success: function(res) {
        let salesArray = res.data.data.salestypeArray;
        let newsalesArray = [];
        for (let i = 1; i < salesArray.length; i++) {
          newsalesArray.push(salesArray[i])
        }
        that.setData({
          selectSales: newsalesArray
        })
      }
    })
  },
  //文本域输入内容
  getInput: function(e) {
    let that = this;
    this.setData({
      currentInput: e.detail.value
    })

  },
  //上传图片结束
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({

      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        // ("",res);
        var data = res.data;
        // that.setData({
        //   files: that.data.files.concat(res.tempFilePaths)
        // });
        // ('图片集合：');
        // (that.data.files)

        wx.uploadFile({
          url: u+'/jujube/file/imageUpload',
          header: header,
          filePath: tempFilePaths[0],
          name: 'file',

          success: function(res) {

            let resp = JSON.parse(res.data)
            // ("resp",resp.fileName)
            var imgpath = getApp().globalData.imgPath + resp.fileName;
            if (resp.code == 0) {
              that.setData({
                files: that.data.files.concat(imgpath)
              });
            }
          }
        })
      }
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

      //}
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
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
  //销售下拉框是否显示
  mySalesSelect(e) {
    var name = e.currentTarget.dataset.name;
    var salesId = e.currentTarget.dataset.id;
    this.setData({
      salesType: name,
      salesId: salesId,
      selectSales: false
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
    if (!e.detail.value.num.length || !e.detail.value.address.length || !that.data.productId || !that.data.salesId) {
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
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({
      mask: true
    })
    wx.request({
      url: u+"/jujube/salesinfo/add",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "inPhont": true,
        "id": that.data.id,
        "productid": that.data.productId,
        "sum": e.detail.value.num,
        "city": that.data.cityValue,
        "address": e.detail.value.address,
        "salestime": that.data.dates,
        "salestype": that.data.salesId
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