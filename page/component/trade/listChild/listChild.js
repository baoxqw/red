var header = getApp().globalData.header;
var u = getApp().globalData.u;
const moment = require('../../../../util/moment.min.js');
Page({
  data: {
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
    lis: false,
    bottomLineShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var formData = JSON.parse(options.JsonData);
    that.setData({
      id: formData.id
    });
    moment.locale('en', {
      longDateFormat: {
        l: "YYYY-MM-DD",
        L: "YYYY-MM-DD HH:mm"
      }
    });
    // //显示列表信息
    wx.request({
      url: u+"/jujube/order/salesorder/suborder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": "",
        "orderid": that.data.id
      }),
      success: function(res) {
        (res)
        let lists = res.data.data.list;
        if (res.data.data.list) {
          if (res.data.data.list.length > 0) {
            lists.forEach(v => {
              // v.createtime = v.createtime.substring(0, 10);
              v.createtime = moment(v.createtime).format('l');
            })
            that.setData({
              lists: lists,
              lis: true
            });
          } else {
            that.setData({
              lis: false
            });
          }
        }
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

  addLists: function() {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/order/salesorder/suborder/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": that.data.pageNo,
        "pageSize": 10,
        "queryStr": "",
        "orderid": that.data.id
      }),
      success: function(res) {

        if (res.data.data.list) {
          let lists = res.data.data.list;
          if (lists.length == 0) {
            that.setData({
              bottomLineShow: true
            })
          } else {
            lists.forEach(v => {
              v.createtime = v.createtime.substring(0, 10);
            })
            let preLists = that.data.lists
            that.setData({
              lists: preLists.concat(lists)
            })
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
    let pageNo = this.data.pageNo + 1
    this.setData({
      pageNo: pageNo
    })
    this.addLists()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})