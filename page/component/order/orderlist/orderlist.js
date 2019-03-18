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
    orderid:'',
    orderShow: false,
    orderState:false,
    searchValue: '',
    loading: '上拉加载更多...',
    pageNo: 1,
    lists: [],
    lis:false,
    bottomLineShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let formData = JSON.parse(options.JsonData);
    var orderid = formData.id;
    wx.setStorageSync('orderid', orderid)
    var orderState = formData.orderstate;
    that.setData({ orderid: orderid});
    that.setData({ orderState: orderState })
    wx.request({
      url: u+"/jujube/system/auth/permissionList",
      header: header, //请求时带上这个请求头
      success: function (res) {

        var permissionList = res.data.data.permissionList;
        // var pick = this.data.pick;
        // ('pick:' + pick)
        // 显示添加
        let poweradd = ["addPickInfo", "addMessif", "addPurchase", "addFarmingRecord", "addProcessBatch", "addProcessSubBatch",
          "addProductInfo", "addGrowthInfo", "addOrderInfo", "addSubOrderInfo", "addPackingInfo", "addNoticeInfo",
          "addSalesinfo", "addDeliveInfo", "addApplyInfo", "addUser"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < poweradd.length; j++) {
            if (permissionList[i] == poweradd[j]) {
              that.setData({ add: true });
              //
              break
            }
          }
        }
        //显示编辑
        let powerUpdate = ["updatePickInfo", "updateMessif", "updatePurchase", "updateFarmingRecord",
          "updateProcessBatch", "updateProcessSubBatch", "updateProductInfo", "updateGrowthInfo", "updateOrderInfo",
          "updateSubOrderInfo", "updatePackingInfo", "updateNoticeInfo", "updateSalesinfo", "updateDeliveInfo",
          "updateApplyInfo", "updateUser"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < powerUpdate.length; j++) {
            if (permissionList[i] == powerUpdate[j]) {
              //
              that.setData({ update: true });
              break
            }
          }
        }
        //显示删除
        let powerDel = ["deletePickInfo", "deleteMessif", "deletePurchase", "deleteFarmingRecord",
          "deleteProcessBatch", "deleteProcessSubBatch", "deleteProductInfo", "deleteGrowthInfo", "deleteOrderInfo",
          "deleteSubOrderInfo", "deletePackingInfo", "deleteNoticeInfo", "deleteSalesinfo", "deleteDeliveInfo",
          "deleteApplyInfo", "deletePickInfo", "deleteUser"];
        for (let i = 0; i < permissionList.length; i++) {
          for (let j = 0; j < powerDel.length; j++) {
            //
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
      url: u+"/jujube/subOrder/keyFindOrder",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: 1,
        pageSize: 10,
        orderid: that.data.orderid,
        key: ""
      }),
      success: function (res) {
        if (res.data.data.data){
          if (res.data.data.data.length>0){
            let lists = res.data.data.data;
            lists.forEach(v => {
              v.createtime = v.createtime.substring(0, 10);
            })
            // that.setData({ lists: lists });
          }else{
            that.setData({ lis: true })
          }
          that.setData({ lists: res.data.data.data });
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
    wx.request({
      url: u+"/jujube/subOrder/delete",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
        id: that.data.delateId
      }),
      success: function (res) {
        that.onLoad()
      }
    })
  },
  //修改
  updateTo: function (e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../updateChild/updateChild?JsonData=${JSON.stringify(data)}`
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
  // update: function () {
  //   wx.navigateTo({
  //     url: '../update/update'
  //   })
  // },
  //搜索
  userNameInput: function (e) {
    const that = this;
    that.setData({ searchValue: e.detail.value })
    wx.request({
      url: u+"/jujube/subOrder/keyFindOrder",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: that.data.pageNo,
        pageSize: 10,
        orderid: that.data.orderid,
        key: e.detail.value ,
      }),
      success: function (res) {
        let lists = res.data.data.data;
        console.log(lists)
        lists.forEach(v => {
          v.createtime = v.createtime.substring(0, 10);
        })
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
      url: u+"/jujube/order/keyFindOrder",
      header: header, //请求时带上这个请求头
      method: 'get',
      data: ({
        currentPage: that.data.pageNo,
        pageSize: 10,
        key: ""
      }),
      success: function (res) {
        let lists = res.data.data.data;
        if (lists.length == 0) {
          that.setData({ bottomLineShow: true })
        } else {
          lists.forEach(v => {
            v.createtime = v.createtime.substring(0, 10);
          })
          let preLists = that.data.lists
          that.setData({ lists: preLists.concat(lists) })
          // that.setData({ lists: [].concat(lists, preLists) })
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