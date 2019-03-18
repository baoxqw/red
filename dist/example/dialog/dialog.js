Page({
    openConfirm: function () {
        wx.showModal({
            title: '弹窗标题',
            content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
            confirmText: "主操作",
            cancelText: "辅助操作",
            success: function (res) {
                (res);
                if (res.confirm) {
                    ('用户点击主操作')
                }else{
                    ('用户点击辅助操作')
                }
            }
        });
    },
    openAlert: function () {
        wx.showModal({
            content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    ('用户点击确定')
                }
            }
        });
    }
});