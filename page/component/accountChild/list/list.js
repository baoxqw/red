var header = getApp().globalData.header;
var u = getApp().globalData.u;
Page({
  data: {
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
    bottomLineShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // //显示列表信息
    wx.request({
      url: u+"/jujube/system/user/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": ""
      }),
      success: function (res) {
        let lists = res.data.data.list;
        if (res.data.code == 200){
          if (res.data.data.list) {
            lists.forEach(v => {
              v.registtime = v.registtime.substring(0, 10);
            })
          }
          that.setData({ lists: lists })
        }
      
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
  // 删除 按钮
  yes: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    wx.showLoading({
      title: '正在删除',
    })
    wx.request({
      url: u+"/jujube/system/user/delete",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.delateId
      }),
      success: function (res) {
        
        if(res.data.code == 200){
          wx.hideLoading();
          that.onLoad()
        }
       
        // that.setData({ lists: res.data.data.list })
      }
    })
  },
  no: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
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
  //搜索
  userNameInput: function (e) {
    const that = this;
    that.setData({ searchValue: e.detail.value })
    wx.request({
      url: u+"/jujube/system/user/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        "pageNo": 1,
        "pageSize": 10,
        "queryStr": that.data.searchValue
      }),
      success: function (res) {
    
        if (res.data.code == 200) {
          if (res.data.data.list) {
            let lists = res.data.data.list;
            lists.forEach(v => {
              v.registtime = v.registtime.substring(0, 10);
            })
            that.setData({ lists: lists })
          }
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
      url: u+"/jujube/system/user/list",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        pageNo: that.data.pageNo,
        pageSize: 10,
        queryStr: ""
      }),
      success: function (res) {
        (res);
        if(res.data.code == 200){
          if (res.data.data.list) {
            let lists = res.data.data.list;
            if (lists.length == 0) {
              that.setData({ bottomLineShow: true })
            } else {
              lists.forEach(v => {
                v.registtime = v.registtime.substring(0, 10);
              })
              let preLists = that.data.lists
              that.setData({ lists: preLists.concat(lists) })
              // that.setData({ lists: [].concat(lists, preLists) })
            }
          }
          wx.hideLoading() //完成停止加载
        }
      
       
      }
    })
  },
  navigatorTo: function (e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../update/update?JsonData=${JSON.stringify(data)}`
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
    let pageNo = this.data.pageNo + 1
    this.setData({ pageNo: pageNo })
    this.addLists()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})