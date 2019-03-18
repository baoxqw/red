var header = getApp().globalData.header;
var u = getApp().globalData.u;
Page({
  data: {
    nn: 1,
    all:1,
    showView: false,
    showAdd: false,
    add: false,
    update: false,
    deleted: false,
    hidden: true,
    orderid: '',
    orderShow: false,
    orderState: false,
    searchValue: '',
    loading: '上拉加载更多...',
    pageNo: 1,
    lists: [],
    bottomLineShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.request({
      url: u+"/jujube/system/auth/permissionList",
      header: header, //请求时带上这个请求头
      success: function (res) {
        var permissionList = res.data.data.permissionList;
      }
    })
    // //显示列表信息
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": that.data.pageNo,
        "pageSize": 10,
        "queryStr": "",
        "orderType": "all",
      }),
      success: function (res) {
        (res)
        let lists = res.data.data.list;
        lists.forEach(v => {
          v.createtime = v.createtime.substring(0, 10);
        })
        that.setData({ lists: lists });
        // (that.data.lists)
        // (that.data.orderShow);
      }
    })
  },
  onChangeShowState: function (e) {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
      delateId: e.currentTarget.dataset.data
    });
    
    // (e.currentTarget.dataset.data)
    // (that.data.showView)
  },
  onChangeShowRoundState: function () {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  //处理
  handle: function (e) {
    let that = this;
    let handleid = e.currentTarget.dataset.data;
    that.setData({ handleid: handleid});
    wx.request({
      url: u+"/jujube/order/salesorder/process",
      method: 'get',
      header: header, //请求时带上这个请求头
      data:({
        id: that.data.handleid
      }),
      success: function(res){
        that.onLoad()
      }
    })

  },
  // 删除 按钮
  yes: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    wx.request({
      url: u+"/jujube/subOrder/delete",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        id: that.data.delateId
      }),
      success: function (res) {
        
        // //显示列表信息
        wx.request({
          url: u+"/jujube/subOrder/keyFindOrder",
          header: header, //请求时带上这个请求头
          method: 'get',
          data: ({
            currentPage: that.data.pageNo,
            pageSize: 10,
            orderid: that.data.orderid,
            key: ""
          }),
          success: function (res) {
            let lists = res.data.data.data;
            lists.forEach(v => {
              v.createtime = v.createtime.substring(0, 10);
            })
            that.setData({ lists: lists })
            (that.data.orderShow);
          }
        })
      }
    })
  },
  //修改
  lookChild: function (e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../listChild/listChild?JsonData=${JSON.stringify(data)}`
    })
  },
  no: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  //提交订单
  sunOrder: function (e) {
    var that = this;
   
    (e.currentTarget.dataset.data);
    wx.request({
      url: u+'/jujube/subOrder/updateState',
      method: 'get',
      header: header,
      data: ({
        orderid: e.currentTarget.dataset.data
      }),
      success: function (res) {
        if (res.data.code == 200) {

          wx.showToast({
            title: "提交成功",
            icon: 'none',
            duration: 3500
          })
          that.onLoad()
        }
      }
    })

  },
  // 添加轮次 按钮
  roundYes: function () {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  roundNo: function () {
    var that = this;
    that.setData({
      showAdd: (!that.data.showAdd)
    })
  },
  add: function () {
    wx.navigateTo({
      url: '../add/add'
    })
  },
  update: function () {
    wx.navigateTo({
      url: '../update/update'
    })
  },
  //全部
  all: function () {
    const that = this;
    that.setData({
      all: 1,
      nn: 1
    })
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": '',
        "orderType": "all",
      }),
      success: function (res) {
        if (res.data.data.list) {
          let lists = res.data.data.list;
          lists.forEach(v => {
            v.createtime = v.createtime.substring(0, 10);
          })
          that.setData({ lists: lists });
        }

      }
    })
  },
  //创建
  create: function () {
    const that = this;
    that.setData({
      all: 2,
      nn: 2
    })
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": '',
        "orderType": "create",
      }),
      success: function (res) {
        if (res.data.data.list) {
          let lists = res.data.data.list;
          lists.forEach(v => {
            v.createtime = v.createtime.substring(0, 10);
          })
          that.setData({ lists: lists });
        }

      }
    })
  },
  //接受
  accept: function () {
    const that = this;
    that.setData({ 
      nn: 3 ,
      all:3
      })
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": '',
        "orderType": "unprocess",
      }),
      success: function (res) {
        if (res.data.data.list) {
          let lists = res.data.data.list;
          lists.forEach(v => {
            v.createtime = v.createtime.substring(0, 10);
          })
          that.setData({ lists: lists });
        }

      }
    })
  },
  //搜索
  userNameInput: function (e) {
    const that = this;
    that.setData({ searchValue: e.detail.value })
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": that.data.searchValue,
        "orderType": "all",
      }),
      success: function (res) {
        if (res.data.data.list){
          let lists = res.data.data.list;
          lists.forEach(v => {
            v.createtime = v.createtime.substring(0, 10);
          })
          that.setData({ lists: lists });
        }
        
      }
    })
  },
  addLists: function () {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": that.data.pageNo,
        "pageSize": 10,
        "queryStr": '',
        "orderType": "all",
      }),
      success: function (res) {
        
        if (res.data.data.list){
          let lists = res.data.data.list;
          if (lists.length == 0) {
            that.setData({ bottomLineShow: true })
          } else {
            lists.forEach(v => {
              v.createtime = v.createtime.substring(0, 10);
            })
            let preLists = that.data.lists
            that.setData({ lists: preLists.concat(lists) })
          }
        }
        wx.hideLoading() //完成停止加载
      }
    })
  },
  //创建
  createaddLists: function () {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": that.data.pageNo,
        "pageSize": 10,
        "queryStr": '',
        "orderType": "create",
      }),
      success: function (res) {

        if (res.data.data.list) {
          let lists = res.data.data.list;
          if (lists.length == 0) {
            that.setData({ bottomLineShow: true })
          } else {
            lists.forEach(v => {
              v.createtime = v.createtime.substring(0, 10);
            })
            let preLists = that.data.lists
            that.setData({ lists: preLists.concat(lists) })
          }
        }
        wx.hideLoading() //完成停止加载
      }
    })
  },
  //接受
  acceptaddLists: function () {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/order/salesorder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": that.data.pageNo,
        "pageSize": 10,
        "queryStr": '',
        "orderType": "unprocess",
      }),
      success: function (res) {

        if (res.data.data.list) {
          let lists = res.data.data.list;
          if (lists.length == 0) {
            that.setData({ bottomLineShow: true })
          } else {
            lists.forEach(v => {
              v.createtime = v.createtime.substring(0, 10);
            })
            let preLists = that.data.lists
            that.setData({ lists: preLists.concat(lists) })
          }
        }
        wx.hideLoading() //完成停止加载
      }
    })
  },
  // navigatorTo: function (e) {
  //   let data = e.currentTarget.dataset.data
  //   wx.navigateTo({
  //     url: `../update/update?JsonData=${JSON.stringify(data)}`
  //   })
  // },
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
    wx.hideTabBar({})
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
    ("pull")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let pageNo = this.data.pageNo + 1
    this.setData({ pageNo: pageNo })
    if (that.data.all == 1) {
      this.addLists()
    }
    else if (that.data.all == 2) {
      this.createaddLists()
    }
    else if (that.data.all == 3) {
      this.acceptaddLists()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})