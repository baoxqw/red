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
var util = require('../../../../util/util.js') //先引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    landarray: ['请查看', '第一个'],
    managearray: [],
    turnarray: [],
    turnindex: 0,
    landindex: 0,
    manageindex: 0,
    mask: false,
    next: true,
    video: '',
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
    addSource: [],
    files: [],
    nofiles: [],
    infos: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    var systemTime = util.formatTime(new Date());
    that.setData({
      dates: systemTime
    });
    //地块下拉框数据
    wx.request({
      url: u+"/jujube/growthrecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
      }),
      success: function(res) {

        let landArray = res.data.data.massifsArray;
        that.setData({
          landarray: landArray
        })
      }
    });
    //生长阶段下拉框数据请求
    wx.request({
      url: u+"/jujube/growthrecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
      }),
      success: function(res) {

        let managetypeArray = res.data.data.growthstageArray;
        that.setData({
          managearray: managetypeArray
        })
      }
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
        wx.showLoading({
          title: '正在上传...',
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
          success: function(res) {

            let resp = JSON.parse(res.data)
            if (resp.msg == "上传成功") {
              wx.hideLoading();
              that.setData({
                next: true,
                mask: false,
              })
              var imgpath = getApp().globalData.imgPath + resp.fileName;
              if (resp.code == 0) {
                that.setData({
                  files: that.data.files.concat(imgpath),
                  nofiles: that.data.nofiles.concat(resp.fileName),
                });
              }

            }

          }
        })
      }
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

      //}
    })
  },
  //删除图片
  clearImg: function(e) {
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
  // 地块
  bindPickerChange: function(e) {
    let that = this;
    //地块下拉框数据请求
    var landid = that.data.landarray[e.detail.value].value;

    that.setData({
      landid: landid,
      landindex: e.detail.value
    })
    //请求轮次的数据
    //轮次下拉框数据请求
    wx.request({
      url: u+"/jujube/growthrecord/selectMassifChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: landid
      }),
      success: function(res) {
        let turnList = res.data.data;
        if (turnList.length > 0) {
          that.setData({
            turnarray: turnList
          })
        } else {
          that.setData({
            turnarray: [],
            turnid: null
          })
        }

      }
    })
  },
  // 轮次
  turnPickerChange: function(e) {
    let that = this;
    //地块下拉框数据请求
    if (that.data.turnarray) {
      if (that.data.turnarray.length > 0) {
        let turnid = that.data.turnarray[e.detail.value].value;

        that.setData({
          turnid: turnid,
          turnindex: e.detail.value
        })
      }
    }

  },
  // 生长阶段
  managebindPickerChange: function(e) {
    let that = this;
    //地块下拉框数据请求
    let manageid = that.data.managearray[e.detail.value].value;

    that.setData({
      manageid: manageid,
      manageindex: e.detail.value
    })
  },
  // previewImage: function(e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  //上传视频
  geted: function() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60, //拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: ['front', 'back'], //前置或者后置摄像头，默认为前后都有，即：['front', 'back']
      success: function(res) {
        var tempvideoFilePaths = res.tempFilePath;
        wx.showLoading({
          title: "上传中..."
        })
        that.setData({
          next: false,
          mask: true,
        })
        wx.uploadFile({
          url: u+'/jujube/file/videoUpload',
          header: header,
          filePath: tempvideoFilePaths,
          name: 'file',

          success: function(res) {
            let resp = JSON.parse(res.data);
            if (resp.msg == "上传成功") {
              wx.hideLoading() //完成停止加载
              that.setData({
                next: true,
                mask: false,
              })
              // var videopath = resp.fileName;
              var videopath = getApp().globalData.videoPath + resp.fileName;
              if (resp.code == 0) {
                that.setData({
                  src: videopath,
                  video: videopath,
                  novideo: resp.fileName
                });
              }
            }
          }
        })
      }
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
    if (!that.data.next) {
      return
    }
    if (!that.data.files.length) {
      wx.showToast({
        title: "将表单填写完整",
        icon: 'none',
        duration: 3500
      })
      return
    }
    if (!that.data.landid || !that.data.manageid) {
      wx.showToast({
        title: "将表单填写完整",
        icon: 'none',
        duration: 3500
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
      url: u+"/jujube/growthrecord/add",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "massifid": that.data.landid,
        "turnid": that.data.turnid,
        "recordid": that.data.manageid,
        "growthpic": that.data.nofiles.join(),
        "growthrecordtime": that.data.dates
      }),
      success: function(res) {
        wx.hideLoading();
        that.setData({
          mask: false
        })
        // ()
        // (that.data.turnid);//轮次
        if (res.data.code == 200) {
          console.log(res)
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

    // wx.setStorageSync('landName', that.data.tihuoWay);
    // ()
    // (that.data.landid);//地块
    // (that.data.turnid);//轮次
    // (that.data.manageid);//生长
    //(that.data.files.join())//照片

    // (that.data.dates);//日期
    // (e.detail.value.usenum);//用量
    // (that.data.dan)//用量单位
    // (that.data.namefarmid)//名称id

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