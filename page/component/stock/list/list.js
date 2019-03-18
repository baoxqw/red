// page/component/list/list.js
const charts = require('../../../../util/wxcharts.js'); // 引入wx-charts.js文件
var header = getApp().globalData.header;
var u = getApp().globalData.u;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    showAdd: false,
    weight:'255544'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // //显示列表信息
    wx.request({
      url: u+"/jujube/warehouse/searchLevelMap",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({

      }),
      success: function(res) {
        let first = res.data.data;
        let list = [];
        first.forEach(function(v) {
          let a = {
            name: '',
            data: ''
          };
          a.name = v.name
          a.data = v.value
          list.push(a)
        });
        new charts({
          canvasId: 'pieGraph',
          type: 'pie', //图表类型
          series:list,
          width: 340, //宽度，单位px
          height: 200, //高度，单位px
          dataLabel: true, // 是否在图表中显示数据内容值
          legend: true, //是否显示图表下方个类别的标识
        })
      }
    });
    //第二个
    wx.request({
      url: u+"/jujube/warehouse/searchWeightMap",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
      }),
      success: function (res) {
        let second = res.data.data;

        let listsecond = [];
        second.forEach(function (v) {
          let a = {
            name: '',
            data: ''
          };
          a.name = v.name
          a.data = v.value
          listsecond.push(a)
        });

        new charts({
          canvasId: 'pieGraphTwo',
          type: 'pie', //图表类型
          series: listsecond,
          width: 340, //宽度，单位px
          height: 200, //高度，单位px
          dataLabel: true, // 是否在图表中显示数据内容值
          legend: true, //是否显示图表下方个类别的标识
        });
      }
    });
    //第三个
    wx.request({
      url: u+"/jujube/warehouse/searchLevel",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({
      }),
      success: function (res) {
        let third = res.data.data;
        let list = []
          let a = {
            name:'等级',
            data: third
          };
          list.push(a)

        new charts({
          canvasId: 'columnCanvas',
          type: 'column',
          categories: ['一等品', '二等品', '三等品'],
          series: list,
          yAxis: {
            format: function (val) {
              return val;
            },
           min:0,

          },
          width: 400,
          height: 200,
          dataLabel: true,
          legend: true, //是否显示图表下方个类别的标识
        });
      }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    //获取总重量
    wx.request({
      url: u+"/jujube/warehouse/searchWeightTotal",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({

      }),
      success: function (res) {
        if (res.data.code == 200) {
          var weight = res.data.data;
          that.setData({ weight: weight })
        }
      }
    })
    //总数量
    wx.request({
      url: u+"/jujube/warehouse/searchLevelTotal",
      header: header, //请求时带上这个请求头
      method: 'post',
      data: ({

      }),
      success: function (res) {
        if (res.data.code == 200) {
          var num = res.data.data;
          that.setData({ num: num })
        }
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})