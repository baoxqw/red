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
    num: true,
    mask: false,
    index:0,
    next:true,
    productId: '',
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
    infos: {},
    selectSource: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //商品等级
    wx.request({
      url: u+"/jujube/product/getLevel",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({

      }),
      success: function (res) {
        let massifsArray = res.data.data;
        that.setData({ workarray: massifsArray })
      }
    })
  },
  //输入框只允许输入数字
  check: function (e) {
    let that = this;
    var regNum = new RegExp('[0-9]', 'g');//判断用户输入的是否为数字
    var rsNum = regNum.exec(e.detail.value);
    if (!rsNum) {
      wx.showToast({
        title: '只允许输入数字',
        icon: 'none',
        duration: 2000
      })
      that.setData({num: false})
    }else{
      that.setData({ num: true })
    }
  },
  bindPickerChange: function (e) {
    let that = this;

    // 加工批次名称id
    let productId = that.data.workarray[e.detail.value].value
    this.setData({
      index: e.detail.value,
      productId: productId
    })
  },
  /**
  * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
  */
  videoErrorCallback: function (e) {
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

  },
  //文本域输入内容
  getInput: function (e) {
    let that = this;
    this.setData({
      currentInput: e.detail.value
    })

  },
  //上传图片结束
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
            if (resp.msg == "上传成功"){
               wx.hideLoading() //完成停止加载
              that.setData({
                next: true,
                mask: false,
              })
              var imgpath = getApp().globalData.imgPath + resp.fileName;
              var nofiles = resp.fileName;
              if (resp.code == 0) {
                that.setData({
                  files: that.data.files.concat(imgpath),
                  nofiles: that.data.files.concat(resp.fileName)
                });
              }
            }
            // ("resp",resp.fileName)
         
          }
        })
      }
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

      //}
    })
  },
  // previewImage: function (e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  //删除图片
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
  //提交表单
  formSubmit: function (e) {
    var that = this;
    if(!that.data.next){
      return
    }
    if (!e.detail.value.name.length || !e.detail.value.size.length ||
      !that.data.currentInput.length || !that.data.productId) {
      wx.showToast({
        title: '将表单填写完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!that.data.num){
      wx.showToast({
        title: '注意表单格式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.files.length){
      wx.showToast({
        title: '请上传图片',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '正在提交表单',
    })
    that.setData({ mask: true })
      wx.request({
        url: u+"/jujube/product/insert",
        header: header, //请求时带上这个请求头
        method: 'post',
        data: ({
          name: e.detail.value.name,
          size: e.detail.value.size,
          picture: that.data.nofiles.join(),
          discribe: that.data.currentInput,
          productlevel: that.data.productId
        }),
        success: function (res) {
          wx.hideLoading();
          that.setData({ mask: false })
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