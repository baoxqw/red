var header = getApp().globalData.header;
var u = getApp().globalData.u;
const moment = require('../../../../util/moment.min.js');

Page({
  data: {
    nn: 1,
    showView: false,
    showAdd: false,
    add: false,
    update: false,
    deleted: false,
    hidden: true,
    searchValue: '',
    loading: '上拉加载更多...',
    pageNo: 1,
    lists: [],
    bottomLineShow: false,
    all: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: u+"/jujube/system/auth/permissionList",
      header: header, //请求时带上这个请求头
      success: function(res) {
        var permissionList = res.data.data.permissionList;
        // 显示添加
        let poweradd = ["addNoticeInfo"];

        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < poweradd.length; j++) {
            if (permissionList[i] == poweradd[j]) {
              that.setData({
                add: true
              });
              break
            }
          }
        }
        //显示编辑
        let powerUpdate = ["updatePurchase", "updateFarmingRecord",
          "updateProcessBatch", "updateProcessSubBatch", "updateProductInfo", "updateGrowthInfo", "updateOrderInfo",
          "updateSubOrderInfo", "updatePackingInfo", "updateNoticeInfo", "updateSalesinfo", "updateDeliveInfo",
          "updateApplyInfo", "updateUser"
        ];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < powerUpdate.length; j++) {
            if (permissionList[i] == powerUpdate[j]) {
              that.setData({
                update: true
              });
              break
            }
          }
        }
        //显示删除
        let powerDel = ["deletePurchase", "deleteFarmingRecord",
          "deleteProcessBatch", "deleteProcessSubBatch", "deleteProductInfo", "deleteGrowthInfo", "deleteOrderInfo",
          "deleteSubOrderInfo", "deletePackingInfo", "deleteNoticeInfo", "deleteSalesinfo", "deleteDeliveInfo",
          "deleteApplyInfo", "deletePickInfo", "deleteUser"
        ];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < powerDel.length; j++) {
            if (permissionList[i] == powerDel[j]) {
              that.setData({
                deleted: true
              });
              return
            }
          }
        }
      }
    })
    moment.locale('en', {
      longDateFormat: {
        l: "YYYY-MM-DD",
        L: "YYYY-MM-DD HH:mm"
      }
    });
    // //显示列表信息
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: 1,
        pageSize: 5,
        queryStr: "",
        noticeType: 'all'
      }),
      success: function(res) {
        let lists = res.data.data.list;
        lists.forEach(v => {
          v.uploadtime = moment(v.uploadtime).format('l');
        })
        that.setData({
          lists: lists
        })
      }
    })
  },
  onChangeShowState: function(e) {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
      delateId: e.currentTarget.dataset.data
    });

    // (e.currentTarget.dataset.data)
    // (that.data.showView)
  },
  onChangeShowRoundState: function() {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  // 删除 按钮
  yes: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    wx.request({
      url: u+"/jujube/pickRecord/delete",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.delateId
      }),
      success: function(res) {
        that.onLoad()
      }
    })
  },
  no: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 添加轮次 按钮
  roundYes: function() {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  roundNo: function() {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  add: function() {
    wx.navigateTo({
      url: '../add/add'
    })
  },
  update: function() {
    wx.navigateTo({
      url: '../update/update'
    })
  },

  //搜索
  userNameInput: function(e) {
    const that = this;
    that.setData({
      searchValue: e.detail.value
    })
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: 1,
        pageSize: 5,
        queryStr: that.data.searchValue,
        noticeType: 'all'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        let lists = res.data.data.list;
        lists.forEach(v => {
          // v.uploadtime = v.uploadtime.substring(0, 10);
          v.uploadtime = moment(v.uploadtime).format('l');
        })
        that.setData({
          lists: lists
        })
      }
    })
  },


  addLists: function() {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: that.data.pageNo,
        pageSize: 5,
        queryStr: "",
        noticeType: 'all'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        let lists = res.data.data.list;
        if (lists.length == 0) {
          that.setData({
            bottomLineShow: true
          })
        } else {
          lists.forEach(v => {
            // v.uploadtime = v.uploadtime.substring(0, 10);
            v.uploadtime = moment(v.uploadtime).format('l');
          })
          let preLists = that.data.lists
          that.setData({
            lists: preLists.concat(lists)
          })
          // that.setData({ lists: [].concat(lists, preLists) })
        }
        wx.hideLoading() //完成停止加载
      }
    })
  },
  //全部
  all: function() {
    let that = this;
    that.setData({
      all: 1,
      nn: 1
    })
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: 1,
        pageSize: 5,
        queryStr: "",
        noticeType: 'all'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        let lists = res.data.data.list;
        lists.forEach(v => {
          // v.uploadtime = v.uploadtime.substring(0, 10);
          v.uploadtime = moment(v.uploadtime).format('l');
        })
        that.setData({
          lists: lists
        });
        
      }
    });
  },
  //创建
  create: function() {
    let that = this;
    that.setData({
        all: 2,
        nn: 2
      })
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: 1,
        pageSize: 5,
        queryStr: "",
        noticeType: 'create'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        let lists = res.data.data.list;
        lists.forEach(v => {

          // v.uploadtime = v.uploadtime.substring(0, 10);
          v.uploadtime = moment(v.uploadtime).format('l');
        })
        that.setData({
            lists: lists
          })
      }
    })
  },
  //创建的下拉数据
  createaddLists: function() {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: that.data.pageNo,
        pageSize: 5,
        queryStr: "",
        noticeType: 'create'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        let lists = res.data.data.list;
        if (lists.length == 0) {
          that.setData({
            bottomLineShow: true
          })
        } else {
          lists.forEach(v => {
            if (v.uploadtime) {
              // v.uploadtime = v.uploadtime.substring(0, 10);
              v.uploadtime = moment(v.uploadtime).format('l');

            }
          })
          let preLists = that.data.lists
          that.setData({
            lists: preLists.concat(lists)
          })
          // that.setData({ lists: [].concat(lists, preLists) })
        }
        wx.hideLoading() //完成停止加载
      }
    })
  },
  //接受
  accept: function() {
    let that = this;
    that.setData({
      nn: 3,
      all: 3
    })
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: 1,
        pageSize: 5,
        queryStr: "",
        noticeType: 'receive'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        let lists = res.data.data.list;
        lists.forEach(v => {
          // v.uploadtime = v.uploadtime.substring(0, 10);
          v.uploadtime = moment(v.uploadtime).format('l');

        })
        that.setData({
          lists: lists
        });
      }
    })
  },
  //接受的下拉数据
  acceptaddLists: function() {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/notice/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: that.data.pageNo,
        pageSize: 5,
        queryStr: "",
        noticeType: 'receive'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        let lists = res.data.data.list;
        if (lists.length == 0) {
          that.setData({
            bottomLineShow: true
          })
        } else {
          lists.forEach(v => {
            if (v.uploadtime) {
              // v.uploadtime = v.uploadtime.substring(0, 10);
              v.uploadtime = moment(v.uploadtime).format('l');
            }
          })
          let preLists = that.data.lists
          that.setData({
            lists: preLists.concat(lists)
          })
          // that.setData({ lists: [].concat(lists, preLists) })
        }
        wx.hideLoading() //完成停止加载
      }
    })
  },
  navigatorTo: function(e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../update/update?JsonData=${JSON.stringify(data)}`
    })
  },
  //跳到查看页面
  navigatorToLook: function(e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../look/look?JsonData=${JSON.stringify(data)}`
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
    wx.hideTabBar({})
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
    ("pull")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    let pageNo = this.data.pageNo + 1
    this.setData({
      pageNo: pageNo
    })
    if (that.data.all == 1) {
      this.addLists()
    } else if (that.data.all == 2) {
      this.createaddLists()
    } else if (that.data.all == 3) {
      this.acceptaddLists()
    }

  },

  /**
   * 用户点击右上角分享
   */

})