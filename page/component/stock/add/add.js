// page/component/add/add.js
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: '2016-11-08',
    region: ['陕西省', '西安市', '未央区'],
    sourceTypeIndex: 0,
    sourceType: ['拍照', '相册', '拍照或相册'],
    evalList: [{ tempFilePaths: [], imgList: [] }],
    evalListPaths:[],
    sizeTypeIndex: 0,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 0,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tihuoWay:'请选择',
      select : false,
      addSource:[
        {
          display:"地块名称",
          name:"plotName",
          placeholder:"地块名称"
        },
        {
          display: "地块面积",
          name: "plotArea",
          placeholder: "地块面积"
        },
        {
          display: "株行距",
          name: "linewidth",
          placeholder: "株行距"
        },
        {
          display: "树龄",
          name: "treeAge",
          placeholder: "树龄"
        },
      ],
      infos:{
        plotName:"",
        plotArea:"",
        linewidth:"",
        treeAge:""
      },
      selectSource:[
        {
          name:'01',
          value:'农作物品种一类'
        },
        {
          name: '02',
          value: '农作物品种二类'
        },
        {
          name: '03',
          value: '农作物品种三类'
        },
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //添加图片
  joinPicture: function (e) {
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.evalList;
    var that = this;
    var imgNumber = evalList[index].tempFilePaths;
    if (imgNumber.length >= 3) {
      wx.showModal({
        title: '',
        content: '最多上传三张图片',
        showCancel: false,
      })
      return;
    }
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage("album", imgNumber);
          } else if (res.tapIndex == 1) {
            that.chooseWxImage("camera", imgNumber);
          }
        }
      }
    })
  },
  chooseWxImage: function (type, list) {
    var img = list;
    var len = img.length;
    var that = this;
    var evalList = this.data.evalList;
    var evalListPaths = this.data.evalListPaths;
    wx.chooseImage({
      count: 3,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function (res) {
        var addImg = res.tempFilePaths;
        var addLen = addImg.length;
        if ((len + addLen) > 3) {
          for (var i = 0; i < (addLen - len); i++) {
            var str = {};
            str.pic = addImg[i];
            evalListPaths.push(addImg[i])
            img.push(str);
          }
        } else {
          for (var j = 0; j < addLen; j++) {
            var str = {};
            str.pic = addImg[j];
            evalListPaths.push(addImg[j])
            img.push(str);
          }
        }
        // (evalListPaths)
        that.setData({
          evalList: evalList,
          evalListPaths: evalListPaths
        })
        // (evalListPaths)
        // that.upLoadImg(img);
      },
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
  // 下拉框
  bindShowMsg() {
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
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoWay: name,
      select: false
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
    (e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  //提交表单
  formSubmit: function (e) {
    (e.detail.value)
    var that = this;
    (that.data.evalListPaths)
  
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