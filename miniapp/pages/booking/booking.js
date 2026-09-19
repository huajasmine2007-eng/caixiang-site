const { request } = require("../../utils/api");

Page({
  data:{
    serviceName:"请选择服务项目", contactName:"", contactMethod:"", preferredDate:"",
    timeOptions:["10:00–12:00","13:00–15:00","15:00–17:00","17:00–19:00"], timeIndex:0,
    cityOptions:["南京仙林工作室","无锡（预约确认地点）","线上咨询"], cityIndex:0,
    note:"", submitting:false, success:false
  },
  onLoad(options){ if(options.service) this.setData({serviceName:decodeURIComponent(options.service)}); },
  input(e){ this.setData({[e.currentTarget.dataset.key]:e.detail.value}); },
  pickDate(e){ this.setData({preferredDate:e.detail.value}); },
  pickTime(e){ this.setData({timeIndex:Number(e.detail.value)}); },
  pickCity(e){ this.setData({cityIndex:Number(e.detail.value)}); },
  async submit(){
    const d=this.data;
    if(d.serviceName==="请选择服务项目"||!d.contactName.trim()||!d.contactMethod.trim()||!d.preferredDate){
      return wx.showToast({title:"请填写完整预约信息",icon:"none"});
    }
    this.setData({submitting:true});
    try{
      await request("/api/appointments",{method:"POST",data:{
        serviceName:d.serviceName,contactName:d.contactName,contactMethod:d.contactMethod,
        preferredDate:d.preferredDate,preferredTime:d.timeOptions[d.timeIndex],city:d.cityOptions[d.cityIndex],note:d.note
      }});
      this.setData({success:true});
    }catch(e){wx.showToast({title:e.message||"提交失败",icon:"none"});}
    finally{this.setData({submitting:false});}
  },
  backHome(){wx.reLaunch({url:"/pages/home/home"});}
});
