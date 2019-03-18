Page({
  data: {
    dates: '2016-11-08',
    times: '12:00',
    objectArray: ['中国', '英国', '美国'],
    index: 0,
  },
  //  点击时间组件确定事件  
  bindTimeChange: function (e) {
    ("谁哦按")
    this.setData({
      times: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    (e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  //  点击城市组件确定事件  
  bindPickerChange: function (e) {
    (e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})