const { request } = require("../../utils/api");
Page({data:{loading:true,results:[]},onShow(){this.load();},async load(){try{const d=await request("/api/assessments");this.setData({results:(d.results||[]).map(x=>({...x,date:new Date(Number(x.createdAt)).toLocaleDateString()}))});}catch(e){wx.showToast({title:e.message||"读取失败",icon:"none"});}finally{this.setData({loading:false});}}});
