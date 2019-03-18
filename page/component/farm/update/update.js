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
    isbigfarm: 1,
    isnamefarm: 1,
    ismfarm: 1,
    island: 1,
    istyped: 1,
    mask: false,
    next: true,
    novideo: '',
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
    next: true,
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
    infos: {},
    selectSource: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let formData = JSON.parse(options.JsonData);
    console.log('上一页数据：');
    console.log(formData)
    let picpath = formData.orchardpic.split(',');
    let nofiles = formData.orchardpic.split(',');
    for (let i in picpath) {
      picpath[i] = getApp().globalData.imgPath + picpath[i]
    }
    console.log(picpath)
    let videopath = formData.orchardvideo; //视频
    videopath = getApp().globalData.videoPath + videopath;
    let novideopath = formData.orchardvideo; //没有拼接路径的视频
    that.setData({
      // bigfarm: bigname,
      // smfarm: smname,
      tihuoWay: formData.massifName, //地块名称
      land: formData.massifName, //地块名称
      landid: formData.massifid, //地块id
      dates: formData.operationtime, //时间
      files: picpath, //图片
      nofiles: nofiles, //没有拼接图片路径的图片
      video: videopath, //视频
      novideo: novideopath, //没有拼接路径的视频
      usenum: formData.consume, //用量
      id: formData.id, //id
      namefarmid: formData.pesticidesid, //农资名称id
      namefarm: formData.pesticidesName, //农资名称name
      turnid: formData.turnid,
      manageid: formData.managetype, //管理类型id
      manage: formData.manageName, //管理类型name
      typed: formData.manageName, //管理类型name
      bigfarmid: formData.catlogId, //农资大类id
      smfarmid: formData.typeId, //农资小类id
    })
    //调取用量单位
    wx.request({
      url: u+"/jujube/register/catalog/getUnit",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        name: that.data.namefarm,
      }),
      success: function(res) {

        that.setData({
          dan: res.data.data
        })
        // let chemicalArray = res.data.data.chemicalArray;
        // that.setData({ nameselectSource: chemicalArray })
      }
    })

    //调取轮次id接口
    wx.request({
      url: u+"/jujube/farmingRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.namefarmid,
        massifid: that.data.landid
      }),
      success: function(res) {

        //轮次
        if (res.data.data.turnArray) {
          let turnSource = res.data.data.turnArray;
          that.setData({ turnarray: turnSource})
          turnSource.forEach(function(v) {
            if (v.value == that.data.turnid) {
              that.setData({
                turn: v.label,
              })
              return;
            }
          })
        } else {
          that.setData({
            turn: '暂无轮次',
          })
        }
        //农资大类
        if (res.data.data.turnArray) {
          let bigSource = res.data.data.chemicalCategArray;

          bigSource.forEach(function(v) {
            if (v.value == that.data.bigfarmid) {
              that.setData({
                bigfarm: v.label,
              })
              return;
            }
          })
        }
        //农资小类
        if (res.data.data.turnArray) {
          let smSource = res.data.data.chemicalTypeArray;

          smSource.forEach(function(v) {
            if (v.value == that.data.smfarmid) {
              that.setData({
                smfarm: v.label,
              })
              return;
            }
          })
        }

      }
    })
    // 地块下拉数据
    wx.request({
      url: u+"/jujube/farmingRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
        massifid: '0'
      }),
      success: function(res) {

        let massifsArray = res.data.data.massifsArray;
        that.setData({
          landarray: res.data.data.massifsArray,
        })
      }
    })
    //管理类型
    wx.request({
      url: u+"/jujube/farmingRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
        massifid: '0'
      }),
      success: function(res) {

        let typeArray = res.data.data.managetypeArray;
        that.setData({
          typearray: typeArray
        })
      }
    })
    //农资大类
    wx.request({
      url: u+"/jujube/farmingRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
        massifid: '0'
      }),
      success: function(res) {

        let bigarray = res.data.data.chemicalCategArray;
        that.setData({
          bigarray: bigarray
        })
      }
    })
    //农资小类
    wx.request({
      url: u+"/jujube/farmingRecord/selectCatlogChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.bigfarmid,
      }),
      success: function(res) {

        let smarray = res.data.data.chemicalTypeArray;
        let newsm = {
          label: '请选择',
          value: 0,
        }
        smarray.unshift(newsm)
        that.setData({
          smarray: smarray,
        })
      }
    })
    //农资名称
    wx.request({
      url: u+"/jujube/farmingRecord/selectTypeChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.smfarmid,
      }),
      success: function(res) {
        let namearray = res.data.data.chemicalArray;
        // let newsm = {
        //   label: '请选择',
        //   value: '0'
        // }
        // namearray.unshift(newsm);
        if (namearray.length > 0) {
          that.setData({
            namearray: namearray,
          })
        }
      }
    })
  },
  //输入框只允许输入数字
  check: function(e) {
    let that = this;
    var regNum = new RegExp('[0-9]', 'g'); //判断用户输入的是否为数字
    var rsNum = regNum.exec(e.detail.value);

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
  //重新
  // 地块下拉框数据接口
  bindPickerChange: function(e) {
    let that = this;
    that.setData({
      island: 2
    })
    //地块下拉框数据请求
    let landid = that.data.landarray[e.detail.value].value;
    that.setData({
      landid: landid,
      landindex: e.detail.value
    })
    //调取轮次
    wx.request({
      url: u+"/jujube/farmingRecord/selectMessifChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.landid
      }),
      success: function(res) {
        let turnList = res.data.data;

        if (turnList.length > 0) {
          // let newturn = {
          //   label:'请选择',
          //   value:0
          // }
          // turnList.unshift(newturn);
          let turnid = turnList[0].value
          that.setData({
            turnarray: turnList,
            turnid: turnid
          })
        } else {
          let turnid = null
          that.setData({
            turnid: null,
            turnarray: [],
          })
        }
      }
    })

  },
  //管理类型
  typebindPickerChange: function(e) {
    let that = this;
    that.setData({
      istyped: 2
    })
    //地块下拉框数据请求
    let manageid = that.data.typearray[e.detail.value].value

    that.setData({
      manageid: manageid,
      typeindex: e.detail.value
    })
  },
  // 轮次数据请求
  turnPickerChange: function(e) {
    let that = this;
    if (that.data.turnarray) {
      let turnid = that.data.turnarray[e.detail.value].value;
      that.setData({
        turnid: turnid,
        turnindex: e.detail.value
      })
    }

  },
  //点击农资大类
  bigbindPickerChange: function(e) {
    let that = this;
    that.setData({dan:''});
    that.setData({
      isbigfarm: 2,
      isnamefarm: 2,
      ismfarm: 2
    })
    //地块下拉框数据请求
    let bigfarmid = that.data.bigarray[e.detail.value].value

    that.setData({
      bigfarmid: bigfarmid,
      bigindex: e.detail.value,
      namearray: [],
      nameindex: 0,
      smarray: [],
      smindex: 0,
    })

    //农资小类
    wx.request({
      url: u+"/jujube/farmingRecord/selectCatlogChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.bigfarmid,
      }),
      success: function(res) {

        let smarray = res.data.data.chemicalTypeArray;
        let newsm = {
          label: '请选择',
          value: 0,
        }
        smarray.unshift(newsm)
        let smfarmid = smarray[0].value;
        that.setData({
          smarray: smarray,
          smfarmid: smfarmid
        })
      }
    })
  },
  //点击农资小类
  smbindPickerChange: function(e) {
    let that = this;
    that.setData({ dan: '' });
    that.setData({
      ismfarm: 2,
      isnamefarm: 2,
    })
    //地块下拉框数据请求
    if (that.data.smarray.length > 0) {
      let smfarmid = that.data.smarray[e.detail.value].value
      that.setData({
        smfarmid: smfarmid,
        smindex: e.detail.value,
        namearray: []
      })
      //农资名称
      wx.request({
        url: u+"/jujube/farmingRecord/selectTypeChange",
        header: header, //请求时带上这个请求头
        method: 'get',
        data: ({
          id: that.data.smfarmid,
        }),
        success: function(res) {
          let namearray = res.data.data.chemicalArray;
          let namefarmid = namearray[0].value;
          let namefarm = namearray[0].label;
          // let newsm = {
          //   label: '请选择',
          //   value: '0'
          // }
          // namearray.unshift(newsm);
          if (namearray.length > 0) {
            that.setData({
              namearray: namearray,
              namefarmid: namefarmid,
              namefarm: namefarm
            })
            //获取用量单位
            wx.request({
              url: u+"/jujube/register/catalog/getUnit",
              header: header, //请求时带上这个请求头
              method: 'get',
              data: ({
                name: namefarm,
              }),
              success: function (res) {
                that.setData({ dan: res.data.data })
                // let chemicalArray = res.data.data.chemicalArray;
                // that.setData({ nameselectSource: chemicalArray })
              }
            })
          } else {
            that.setData({
              namearray: []
            })
          }
        }
      })
    } else {
      that.setData({
        namearray: []
      })
    }
  },
  //点击农资名称
  namebindPickerChange: function(e) {
    let that = this;
    //地块下拉框数据请求
    if (that.data.namearray) {
      if (that.data.namearray.length > 0) {
        let namefarmid = that.data.namearray[e.detail.value].value
        that.setData({
          namefarmid: namefarmid,
          nameindex: e.detail.value
        })
        //获取用量单位
        wx.request({
          url: u+"/jujube/register/catalog/getUnit",
          header: header, //请求时带上这个请求头
          method: 'get',
          data: ({
            name: that.data.namearray[e.detail.value].label
          }),
          success: function (res) {

            that.setData({
              dan: res.data.data
            })
            // let chemicalArray = res.data.data.chemicalArray;
            // that.setData({ nameselectSource: chemicalArray })
          }
        })

      } else {
        that.setData({
          namearray: [],
          namefarm: that.data.namearray[e.detail.value].label
        })
      }
    }


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
          title: '上传中....',

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
              wx.hideLoading() //完成时停止加载
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
  // previewImage: function (e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
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

          success: function(res) {
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
  videoErrorCallback: function(e) {

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
      url: u+"/jujube/farmingRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
        massifid: '0'
      }),
      success: function(res) {

        let massifsArray = res.data.data.massifsArray;
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
  // 管理类型下拉框数据接口
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
    //管理类型下拉框数据请求
    wx.request({
      url: u+"/jujube/farmingRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
        massifid: '0'
      }),
      success: function(res) {

        let managetypeArray = res.data.data.managetypeArray;
        let newmanagetypeArray = [];
        for (let i = 1; i < managetypeArray.length; i++) {
          newmanagetypeArray.push(managetypeArray[i])
        }
        that.setData({
          selectmanSource: newmanagetypeArray
        })
      }
    })
  },
  //管理类型下拉框是否显示
  manSelect(e) {
    var name = e.currentTarget.dataset.name;
    var manageid = e.currentTarget.dataset.id;
    this.setData({
      manage: name,
      manageid: manageid,
      selectman: false
    })
  },
  //农资大类下拉框数据接口
  bigShowMsg() {
    let that = this;
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
      url: u+"/jujube/farmingRecord/selectDataSource",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: '0',
        massifid: '0'
      }),
      success: function(res) {

        let chemicalCategArray = res.data.data.chemicalCategArray;
        let newchemicalCategArray = [];
        for (let i = 1; i < chemicalCategArray.length; i++) {
          newchemicalCategArray.push(chemicalCategArray[i])
        }
        that.setData({
          bigselectSource: newchemicalCategArray
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
      bigfarmid: bigfarm,
      bigselect: false
    })
  },
  //农资小类
  smShowMsg() {
    let that = this;
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
      url: u+"/jujube/farmingRecord/selectCatlogChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.bigfarmid,
      }),
      success: function(res) {

        let chemicalTypeArray = res.data.data.chemicalTypeArray;
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
      smfarmid: smfarmid,
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
      url: u+"/jujube/farmingRecord/selectTypeChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.smfarmid,
      }),
      success: function(res) {

        let chemicalArray = res.data.data.chemicalArray;
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
      namefarmid: namefarmid,
      nameselect: false
    })
    //获取用量单位
    wx.request({
      url: u+"/jujube/register/catalog/getUnit",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        name: that.data.namefarm,
      }),
      success: function(res) {

        that.setData({
          dan: res.data.data
        })
        // let chemicalArray = res.data.data.chemicalArray;
        // that.setData({ nameselectSource: chemicalArray })
      }
    })
  },
  //轮次下拉框是否显示
  turnSelect(e) {
    let name = e.currentTarget.dataset.name;
    // wx.setStorageSync(turnName, name);
    var turnid = e.currentTarget.dataset.id;
    this.setData({
      turn: name,
      turnid: turnid,
      turnSelect: false
    });

    wx.setStorageSync('turnName', name);
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
      url: u+"/jujube/farmingRecord/selectMessifChange",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: getLand
      }),
      success: function(res) {

        // (res.data.data)
        let turnList = [];
        turnList = res.data.data;
        that.setData({
          turnSource: turnList
        })
      }
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

    this.setData({
      dates: e.detail.value
    })
  },
  //提交表单
  formSubmit: function(e) {

    var that = this;
    //当页面显示“正在上传时”，点击提交表单 无效
    if (!that.data.next) {
      return
    }
    // wx.setStorageSync('turnName', that.data.turn);
    // wx.setStorageSync('landName', that.data.tihuoWay);
    // ()
    // (that.data.landid);//地块
    // (that.data.turnid);//轮次
    // (that.data.manageid);//类型
    // (that.data.files.join())//照片
    // (that.data.video)//视频
    // (that.data.dates);//日期
    // (e.detail.value.usenum);//用量
    // (that.data.dan)//用量单位
    // (that.data.namefarmid)//名称id
    if (!that.data.next) {
      return
    }
    if (!that.data.files.length ||
      !e.detail.value.usenum.length) {
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
    if (!that.data.landid || !that.data.namefarmid || !that.data.manageid ||
      !that.data.bigfarmid || !that.data.smfarmid) {
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
      url: u+"/jujube/farmingRecord/add",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "id": that.data.id,
        "unit": that.data.dan,
        "massifid": that.data.landid,
        "turnid": that.data.turnid,
        "pesticidesid": that.data.namefarmid,
        "consume": e.detail.value.usenum,
        "orchardpic": that.data.nofiles.join(),
        "orchardvideo": that.data.novideo,
        "operationtime": that.data.dates,
        "managetype": that.data.manageid,
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

})