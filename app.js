// app.js
App({
  globalData: {
    access_token: ''
  },
  onLaunch:function() {
    wx.request({
      method: 'POST',
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=YuSRhKa7zEHI8daRXbYcV8e7&client_secret=eBeG8vSwcr5BZgklHLhINCqGf5MhYeVk',
      success:(res)=>{
        this.globalData.access_token=res.data.access_token
        console.log(res.data.access_token)
      },
      fail:()=>{
        wx.showToast({
          title: '鉴权失败！',
        })
      }
    })
  }
})
