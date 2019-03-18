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

    // //显示列表信息
    wx.request({
      url: u+"/jujube/storeList/keyFindStore",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": "",
        "orderType": "all",
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
          v.time = moment(v.time).format('l');
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
    });
    if (that.data.nn == 1) {
      wx.request({
        url: u+"/jujube/storeList/keyFindStore",
        header: header, //请求时带上这个请求头
        method: 'post',
        data: ({
          "pageNo": 1,
          "pageSize": 10,
          "queryStr": that.data.searchValue,
          "orderType": "all",
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
            v.time = moment(v.time).format('l');
          })
          that.setData({
            lists: lists
          })
        }
      })
    } else if (that.data.nn == 2) {
      wx.request({
        url: u+"/jujube/storeList/keyFindStore",
        header: header, //请求时带上这个请求头
        method: 'post',
        data: ({
          "pageNo": 1,
          "pageSize": 10,
          "queryStr": that.data.searchValue,
          "orderType": "inHouse",
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
            v.time = moment(v.time).format('l');
          })
          that.setData({
            lists: lists
          })
        }
      })
    } else if (that.data.nn == 3) {
      wx.request({
        url: u+"/jujube/storeList/keyFindStore",
        header: header, //请求时带上这个请求头
        method: 'post',
        data: ({
          "pageNo": 1,
          "pageSize": 10,
          "queryStr": that.data.searchValue,
          "orderType": "outHouse",
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
            v.time = moment(v.time).format('l');
          })
          that.setData({
            lists: lists
          })
        }
      })
    }

  },

  //全部入库的下拉数据
  addLists: function() {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/storeList/keyFindStore",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: that.data.pageNo,
        pageSize: 10,
        queryStr: "",
        orderType: 'all'
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        if (res.data.data.list) {
          let lists = res.data.data.list;
          if (lists.length == 0) {
            that.setData({
              bottomLineShow: true
            })
          } else {
            lists.forEach(v => {
              if (v.time) {
                v.time = moment(v.time).format('l');

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
      }
    })
  },
  //入库记录的下拉数据
  addinLists: function() {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/storeList/keyFindStore",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: that.data.pageNo,
        pageSize: 10,
        queryStr: "",
        orderType: "inHouse",
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        if (res.data.data.list) {
          let lists = res.data.data.list;
          if (lists.length == 0) {
            that.setData({
              bottomLineShow: true
            })
          } else {
            lists.forEach(v => {
              if (v.time) {
                // v.time = v.time.substring(0, 10);
                v.time = moment(v.time).format('l');
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
      }
    })
  },
  //出库记录的下拉数据
  addoutLists: function() {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/storeList/keyFindStore",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: that.data.pageNo,
        pageSize: 10,
        queryStr: "",
        orderType: "outHouse",
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        if (res.data.data.list) {
          let lists = res.data.data.list;
          if (lists.length == 0) {
            that.setData({
              bottomLineShow: true
            })
          } else {
            lists.forEach(v => {
              if (v.time) {
                // v.time = v.time.substring(0, 10);
                v.time = moment(v.time).format('l');
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
      }
    })
  },
  //全部库存
  all: function() {
    let that = this;
    that.setData({
      all: 1,
      nn: 1
    })
    wx.request({
      url: u+"/jujube/storeList/keyFindStore",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": "",
        "orderType": "all",
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        if (res.data.data.list) {
          let lists = res.data.data.list;
          lists.forEach(v => {
            // v.time = v.time.substring(0, 10);
            v.time = moment(v.time).format('l');
          })
          that.setData({
            lists: lists
          })
        }
      }
    });

  },
  //入库记录
  create: function() {
    let that = this;
    that.setData({
      all: 2,
      nn: 2
    })

    wx.request({
      url: u+"/jujube/storeList/keyFindStore",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": "",
        "orderType": "inHouse",
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        if (res.data.data.list) {
          let lists = res.data.data.list;
          lists.forEach(v => {
            // v.time = v.time.substring(0, 10);
            v.time = moment(v.time).format('l');
          })
          that.setData({
            lists: lists
          })
        }
      }
    })
  },
  //出库记录
  accept: function() {
    let that = this;
    that.setData({
      all: 3,
      nn: 3
    })
    wx.request({
      url: u+"/jujube/storeList/keyFindStore",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": "",
        "orderType": "outHouse",
      }),
      success: function(res) {
        moment.locale('en', {
          longDateFormat: {
            l: "YYYY-MM-DD",
            L: "YYYY-MM-DD HH:mm"
          }
        });
        if (res.data.data.list) {
          let lists = res.data.data.list;
          lists.forEach(v => {
            // v.time = v.time.substring(0, 10);
            v.time = moment(v.time).format('l');
          })
          that.setData({
            lists: lists
          })
        }

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    let pageNo = this.data.pageNo + 1
    this.setData({
      pageNo: pageNo
    });
    (that.data.all)
    let all = that.data.all;
    if (all == 1) {
      this.addLists()
    } else if (all == 2) {
      this.addinLists()
    } else if (all == 3) {
      this.addoutLists()
    }

  },

  /**
   * 用户点击右上角分享
   */

})