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
    tihuoWay:'请查看',
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
    // //显示列表信息
    
    wx.request({
      url: u + "/jujube/register/massif/keyFindMassif",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: 1,
        pageSize: 10,
        key: ""
      }),
      success: function (res) {
        let lists = res.data.data.data;
        that.setData({ lists: lists})
   
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
  // 地块下拉框数据接口
  bindShowMsg(e) {
  
    let that = this;
    that.setData({
      turn: '请选择'
    })
    var id = e.currentTarget.dataset.typeid;
    var s = id === that.data.currentId;
  
      that.setData({
        currentId: !s
      });
  },

  //地块下拉框是否显示
  mySelect(e) {
    var Index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    var landid = e.currentTarget.dataset.id;
    this.setData({
      // index: Index,
      // tihuoWay: name,
      // landid: landid,
      select: false
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
  //搜索
  userNameInput: function (e) {
    const that = this;
    that.setData({ searchValue: e.detail.value })
    wx.request({
      url: u+"/jujube/register/massif/keyFindMassif",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: 1,
        pageSize: 10,
        key:that.data.searchValue
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
      url: u+"/jujube/register/massif/keyFindMassif",
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
          (lists)
          if (lists.length == 0) {
            that.setData({ bottomLineShow: true })
          } else {
            let preLists = that.data.lists
            (preLists)

            that.setData({ lists: preLists.concat(lists) })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.request({
      url: u+"/jujube/register/massif/keyFindMassif",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: that.data.pageNo,
        pageSize: 10,
        key: ""
      }),
      success: function (res) {
        let lists = res.data.data.data;
        that.setData({ lists: lists })
    
      }
    })
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
  onShareAppMessage: function () {

  }
})