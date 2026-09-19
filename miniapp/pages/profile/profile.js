const { request, upload } = require("../../utils/api");
Page({
  data:{ uploading:"", uploaded:{}, products:[], slots:[
    {kind:"full_body",ko:"전신 정면",zh:"全身正面照",note:"完整露出头顶到鞋底，相机保持腰部高度"},
    {kind:"face_front",ko:"얼굴 정면",zh:"面部正面照",note:"素颜、自然光、正视镜头"},
    {kind:"face_left",ko:"왼쪽 얼굴",zh:"左侧脸照片",note:"头部向左转约90°"},
    {kind:"face_right",ko:"오른쪽 얼굴",zh:"右侧脸照片",note:"头部向右转约90°"}
  ]},
  onShow(){this.load();},
  async load(){try{const [p,r]=await Promise.all([request("/api/profile-photos"),request("/api/recommendations")]);const uploaded={};(p.photos||[]).forEach(x=>uploaded[x.kind]=x.filename);this.setData({uploaded,products:r.products||[]});}catch(_){ }},
  choose(e){const kind=e.currentTarget.dataset.kind;wx.chooseMedia({count:1,mediaType:["image"],sourceType:["camera","album"],success:({tempFiles})=>this.send(kind,tempFiles[0].tempFilePath)});},
  async send(kind,filePath){this.setData({uploading:kind});try{const data=await upload("/api/profile-photos",filePath,{kind});this.setData({[`uploaded.${kind}`]:data.filename||"已上传"});wx.showToast({title:"照片已保存"});}catch(e){wx.showToast({title:e.message||"上传失败",icon:"none"});}finally{this.setData({uploading:""});}},
  openProduct(e){wx.setClipboardData({data:e.currentTarget.dataset.url});}
});
