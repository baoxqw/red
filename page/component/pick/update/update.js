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
    num:true,
    island:1,
    mask: false,
    next:true,
    flies:[],
    video: '',
    novideo:'',
    dates: '2016-11-08',
    region: ['陕西省', '西安市', '未央区'],
    sourceTypeIndex: 0,
    sourceType: ['拍照', '相册', '拍照或相册'],
    evalList: [{ tempFilePaths: [], imgList: [] }],
    evalListPaths: [],
    sizeTypeIndex: 0,
    sizeType: ['压缩', '原图', '压缩或原图'],
    turnid:'',
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
    formData:{},
    video:'',
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let formData = JSON.parse(options.JsonData);
    let picPaths = formData.pickpic.split(",");
    let nofiles = formData.pickpic.split(',');
    let video = formData.pickvideo;
    video = getApp().globalData.videoPath + video;
    for (let i in picPaths) {
      picPaths[i] = getApp().globalData.imgPath + picPaths[i]
    }
    let newArray = [];
    let pickrecordtime = formData.picktime.substring(0, 10);
    this.setData({
      formData: formData,
      land:formData.massifName,
      dates: pickrecordtime,
      video: video,
      files: picPaths,
      nofiles: nofiles,
      massifid: formData.massifid,
      turnid: formData.turnid,
      landid: formData.massifid,
      id: formData.id
      // pickername: 

    })
    //根据地块id 匹配轮次id
    wx.request({
      url: u+"/jujube/pickRecord/selectMassifChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.landid,
       
      }),
      success: function (res) {
        if (res.data.data){
          let source = res.data.data;
          source.forEach(function (v) {
            if(that.data.turnid == v.value){
              that.setData({ turn : v.label})
            }
          })
        }
        

      }
    })
    //地块
    wx.request({
      url: u+"/jujube/pickRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0'
      }),
      success: function (res) {
        let massifsArray = res.data.data.massifsArray;
        that.setData({ landarray: massifsArray })
      }
    })
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
        num: false
      })
    } else {
      that.setData({
        num: true
      })
    }
  },
  //上传图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({

      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        // ("",res);
        wx.showLoading({
          title: '正在上传...',
        })
        that.setData({
          next: false,
          mask: true,
        })
        var data = res.data;
        wx.uploadFile({
          url: u+'/jujube/file/imageUpload',
          header: header,
          filePath: tempFilePaths[0],
          name: 'file',

          success: function (res) {
            let resp = JSON.parse(res.data)
            // ("resp",resp.fileName)
            if (resp.msg == "上传成功") {
              wx.hideLoading();
              that.setData({
                next: true,
                mask: false,
              })
              var imgpath = getApp().globalData.imgPath + resp.fileName;
              // var nofiles = that.data.nofiles.push(resp.fileNam);
              // (nofiles)
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
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

      //}
    })
  },
  //重新
  //地块
  bindPickerChange: function (e) {
    let that = this;
    that.setData({island:2})
    //地块下拉框数据请求
    var landid = that.data.landarray[e.detail.value].value
    that.setData({
      landid: landid,
      landindex: e.detail.value
    })
    //轮次
    wx.request({
      url: u+"/jujube/pickRecord/selectMassifChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: landid
      }),
      success: function (res) {
        // (res.data.data)
        let turnList = [];
        turnList = res.data.data;
        if (turnList.length > 0) {
          that.setData({
            turnarray: turnList,
            turnid: turnList[0].value
          })
        } else {
          that.setData({ turnarray: [] })
        }

      }
    })
  },
  //轮次
  turnPickerChange: function (e) {
    let that = this;
    //地块下拉框数据请求
    if (that.data.turnarray) {
      let turnid = that.data.turnarray[e.detail.value].value
      that.setData({
        turnid: turnid,
        turnindex: e.detail.value
      })
    } else {
      that.setData({
        turnarray: []
      })
    }

  },
  // previewImage: function (e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  // upLoadImg: function (list) {
  //   var that = this;
  //   this.upload(that, list);
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
  //上传视频
  geted: function () {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60, //拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: ['front', 'back'],//前置或者后置摄像头，默认为前后都有，即：['front', 'back']
      success: function (res) {
        var tempvideoFilePaths = res.tempFilePath;
        wx.showLoading({
          title: '上传中....',

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

          success: function (res) {
            let resp = JSON.parse(res.data);
            if (resp.msg == "上传成功") {
              wx.hideLoading();
              that.setData({
                next: true,
                mask: false,
              })
              var videopath = getApp().globalData.videoPath + resp.fileName;
              var novideopath = resp.fileName;
              if (resp.code == 0) {
                that.setData({
                  src: videopath,
                  video: videopath,
                  novideo: novideopath
                });

              }
            }
            // ('视频：');
            // (that.data.src)
          }
        })
      }
    })

  },

  /**
  * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
  */
  videoErrorCallback: function (e) {
  },
  // 地块下拉框数据接口
  bindShowMsg() {
    let that = this;
    that.setData({island:2})
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
        (res)
        that.setData({
          imageList: res.tempFilePaths
        })
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
    // (e.detail.value)
    var that = this;
    if(!that.data.next){
      return
    }
    if (!e.detail.value.pickName.length || !that.data.files  || !e.detail.value.picker.length
      || !e.detail.value.pickArea.length || !e.detail.value.pickWeight.length
    ) {
      wx.showToast({
        title: "将表单填写完整",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.landid) {
      wx.showToast({
        title: "将表单填写完整",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.num) {
      wx.showToast({
        title: "注意表单格式",
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
      url: u+"/jujube/pickRecord/add",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        massifid: that.data.landid,//地块id
        name: e.detail.value.pickName,//采摘批次名称
        pickername: e.detail.value.picker,//采摘负责人
        pickpic: that.data.nofiles.join(),//采摘图片
        picktime: that.data.dates,//采摘时间
        picktotalarea: e.detail.value.pickArea,//采摘总面积
        picktotalweight: e.detail.value.pickWeight,//采摘总重量
        pickvideo: that.data.novideo,//采摘视频
        turnid: that.data.turnid,//采摘轮次id
        id: that.data.id
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