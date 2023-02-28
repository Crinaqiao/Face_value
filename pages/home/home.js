// pages/home/home.js
const app =getApp()
Page({
  data: {
    wh:0,
    // 摄像头的朝向
    position:'front',
    // 照相
    src:'',
    // 展示图片
    isShowPic:false,
    //侧颜值数据
    faceInfo:null,
    map: {
      gender: {
        male: '男',
        female: '女'
      },
      expression: {
        none: '不笑', smile: '微笑', laugh: '大笑'
      },
      glasses: {
        none: '无眼镜', common: '普通眼镜', sun: '墨镜'
      },
      emotion: {
        angry: '愤怒', disgust: '厌恶', fear: '恐惧', happy: '高兴', sad: '伤心', surprise: '惊讶', neutral: '无表情', pouty: '撅嘴', grimace: '鬼脸'
      }
    },
    isShowBox:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 获取窗口高度
  onLoad: function (options) {
    const sysInfo=wx.getSystemInfoSync()
    this.setData({
      wh:sysInfo.windowHeight
    })
  },
// 摄像头翻转
reversCamera(){
  const newPosition = this.data.position==='front'?'back':'front'
  this.setData({
    position:newPosition
  })
},
// 照相
takePhoto(){
  // 创建
  const ctx = wx.createCameraContext()
  ctx.takePhoto({
    quality:'high',
    success:(res)=>{
      
      this.setData({
        src:res.tempImagePath,
        isShowPic:'ture'
      },()=>{this.getFaceInfo()})
    },
    fail:()=>{
      console.log('拍照失败！')
      this.setData({
        src:''
      })
    }
  })
},
// 选择图片
choosePhoto(){
  wx.chooseImage({
    count:1,
    sizeType:['original'],
    sourceType:['album'],
    success:(res)=>{
      if(res.tempFilePaths.length>0){
        console.log(res)
        this.setData({
          src:res.tempFilePaths[0],
          isShowPic:'ture'
        },()=>{this.getFaceInfo()})
      }
    },
    fail:()=>{
      console.log('选择照片失败！')
    }
  })
},
// 重选相片
reChoose(){
  this.setData({
    isShowPic:false,
    src:''
  })
},
// 调用侧颜真的函数
getFaceInfo(){
  // console.log('调用测颜值的函数'),
  // console.log(app.globalData)
  const token =app.globalData.access_token
  if(!token){
    return wx.showToast({
      title: '鉴权失败',
    })
  }
  wx.showLoading({
    title: '颜值检测中...'
  })
  //转码为base64s
  const fileManger= wx.getFileSystemManager()

 
// const fileStr=fileManger.readFileSync(this.data.src,'base64')
 
 const fileStr= wx.getFileSystemManager().readFileSync(this.data.src,'base64');

// console.log("ddd  "+this.data.src)
   
  wx.request({
    method:'POST',
    url:'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token='+token,
    header:{
      'Content-Type':'application/json'
    },
    data:{
      image_type:"BASE64",//
      image:fileStr,
      face_field:"age,expression,beauty,gender,glasses,emotion",
    },
    success:(res)=>{
      console.log(res)
      if(res.data.result.face_num <=0){
        return wx.showToast({
          title: '未检测到人脸！'
        })
      }
       this.setData({
         faceInfo:res.data.result.face_list[0],
         isShowBox:true
       })
    },
    fail:()=>{
      wx.showToast({
        title: '颜值检测失败！',
      })
    },
    complete:()=>{
      wx.hideLoading()
    }
  })
  
},
// 鉴定面部

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})