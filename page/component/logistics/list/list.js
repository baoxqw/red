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
    tihuoWay: '请查看',
    currentId: false,
    selectSource: [],
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
        // var pick = this.data.pick;
        // ('pick:' + pick)
        // 显示添加
        let poweradd = ["addMessif"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < poweradd.length; j++) {
            if (permissionList[i] == poweradd[j]) {
              that.setData({ add: true });
              break
            }
          }
        }
        //显示编辑
        let powerUpdate = ["updateMessif"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < powerUpdate.length; j++) {
            if (permissionList[i] == powerUpdate[j]) {
              that.setData({ update: true });
              break
            }
          }
        }
        //显示删除
        let powerDel = ["deleteMessif"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < powerDel.length; j++) {
            if (permissionList[i] == powerDel[j]) {
              that.setData({ deleted: true });
              return
            }
          }
        }
      }
    })
    // //显示列表信息
    wx.request({
      url: u+"/jujube/deliveinfo/keyFindOrder",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: 1,
        pageSize: 10,
        key: ""
      }),
      success: function (res) {
        let lists = res.data.data.data;
        that.setData({ lists: lists })
      }
    })
  },
  onChangeShowState: function (e) {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
      delateId: e.currentTarget.dataset.data
    });
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
    wx.request({
      url: u+"/jujube/farmingRecord/delete",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        id: that.data.delateId
      }),
      success: function (res) {      
        that.onLoad()
      }
    })
  },
  no: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
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
  //搜索
  userNameInput: function (e) {
    const that = this;
    that.setData({ searchValue: e.detail.value })
    wx.request({
      url: u+"/jujube/deliveinfo/keyFindOrder",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: 1,
        pageSize: 10,
        key: e.detail.value
      }),
      success: function (res) {
        let lists = res.data.data.data;
        that.setData({ lists: lists })
      }
    })
  },
  addLists: function () {
    let that = this
    wx.showLoading({
      title: "加载中..."
    }) //显示加载
    wx.request({
      url: u+"/jujube/deliveinfo/keyFindOrder",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: that.data.pageNo,
        pageSize: 10,
        key: ""
      }),
      success: function (res) {
        if (res.data.data.data) {
          let lists = res.data.data.data;
          if (lists.length == 0) {
            that.setData({ bottomLineShow: true })
          } else {
            let preLists = that.data.lists
            that.setData({ lists: preLists.concat(lists) })
            // that.setData({ lists: [].concat(lists, preLists) })
          }
        }
        wx.hideLoading() //完成停止加载
      }
    })
  },
  //编辑
  navigatorTo: function (e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../update/update?JsonData=${JSON.stringify(data)}`
    })
  },
  //详情
  detail: function (e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../detail/detail?JsonData=${JSON.stringify(data)}`
    })
  },
  //物流发货
  logistic: function (e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../logistics/logistics?JsonData=${JSON.stringify(data)}`
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


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */


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