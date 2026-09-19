const { request, upload } = require("../../utils/api");

const questions = [
  { key:"shoulderLine", ko:"어깨선은 어느 쪽에 더 가까운가요?", zh:"你的肩部线条更接近哪一种？", options:[["soft","둥글고 자연스러운 경사","圆润、有自然斜度"],["balanced","폭이 적당하고 매끄러움","宽窄适中、线条平顺"],["square","수평에 가깝거나 뼈대가 선명함","平直或骨点明显"]] },
  { key:"joints", ko:"관절의 존재감은 어떤가요?", zh:"关节的存在感如何？", options:[["small","작고 눈에 띄지 않음","偏小、不明显"],["balanced","크기와 존재감이 보통","大小适中"],["prominent","뼈대가 선명함","骨点清晰"]] },
  { key:"upperBody", ko:"옆에서 본 상체 두께는?", zh:"从侧面看上半身厚度如何？", options:[["thin","얇고 곡선이 부드러움","偏薄、曲线柔和"],["balanced","두께가 적당함","厚度适中"],["thick","흉곽 두께가 뚜렷함","胸廓厚度明显"]] },
  { key:"texture", ko:"전체적인 체형 질감은?", zh:"整体身体质感更接近？", options:[["soft","부드럽고 섬세함","柔软细腻"],["firm","탄탄하고 탄력이 있음","紧实有弹性"],["bony","골격감이 도드라짐","骨感明显"]] },
  { key:"center", ko:"옷을 입었을 때 시각적 중심은?", zh:"穿衣时视觉重心在哪里？", options:[["upper","가슴·등과 상체","胸背与上半身"],["balanced","상체와 하체가 균형적","上下均衡"],["lower","허리·힙과 하체","腰胯与下半身"]] }
];

Page({
  data: { mode:"color", photo:"", checks:{face:false,glasses:false,light:false}, analyzing:false, colorResult:null, step:0,
    metrics:{height:"",weight:"",shoulder:"",waist:"",hip:""}, questions, current:null, answers:{}, bodyResult:null,
    checkItems:[{k:"face",t:"额头与下巴完整露出"},{k:"glasses",t:"已摘下眼镜和帽子"},{k:"light",t:"自然光、无滤镜"}],
    metricItems:[{k:"height",t:"身高",u:"cm"},{k:"weight",t:"体重",u:"kg"},{k:"shoulder",t:"肩围",u:"cm"},{k:"waist",t:"腰围",u:"cm"},{k:"hip",t:"臀围",u:"cm"}]
  },
  setMode(e){ this.setData({mode:e.currentTarget.dataset.mode}); },
  choosePhoto(){ wx.chooseMedia({count:1,mediaType:["image"],sourceType:["album","camera"],success:({tempFiles})=>this.setData({photo:tempFiles[0].tempFilePath,colorResult:null})}); },
  toggle(e){ const key=e.currentTarget.dataset.key; this.setData({[`checks.${key}`]:!this.data.checks[key]}); },
  async analyzeColor(){
    if(!this.data.photo || !Object.values(this.data.checks).every(Boolean)) return wx.showToast({title:"请完成照片确认",icon:"none"});
    this.setData({analyzing:true});
    try {
      const data = await upload("/api/analyze-photo",this.data.photo,{});
      const a=data.analysis?.appearance; if(!a) throw new Error("视觉模型尚未启用");
      const season=a.undertone==="warm"?(a.value==="light"?"봄 타입 · 春季型":"가을 타입 · 秋季型"):(a.chroma==="soft"?"여름 타입 · 夏季型":"겨울 타입 · 冬季型");
      const result={season,type:`${a.undertone.toUpperCase()} · ${a.value.toUpperCase()} · ${a.chroma.toUpperCase()}`,confidence:Math.round((data.analysis.confidence||0)*100)};
      this.setData({colorResult:result}); await request("/api/assessments",{method:"POST",data:{kind:"color",colorSeason:season,colorType:result.type}});
    } catch(e){ wx.showToast({title:e.message||"分析暂不可用",icon:"none"}); } finally { this.setData({analyzing:false}); }
  },
  metric(e){ this.setData({[`metrics.${e.currentTarget.dataset.key}`]:e.detail.value}); },
  begin(){ if(Object.values(this.data.metrics).some(v=>!Number(v))) return wx.showToast({title:"请填写完整数据",icon:"none"}); this.setData({step:1,current:questions[0]}); },
  select(e){ this.setData({[`answers.${this.data.current.key}`]:e.currentTarget.dataset.value}); },
  next(){ const {step,current,answers}=this.data; if(!answers[current.key]) return; if(step<5)this.setData({step:step+1,current:questions[step]}); else this.finishBody(); },
  back(){ const step=this.data.step; if(step<=1)this.setData({step:0,current:null}); else this.setData({step:step-1,current:questions[step-2]}); },
  async finishBody(){
    const m=this.data.metrics,a=this.data.answers; const shoulder=+m.shoulder,waist=+m.waist,hip=+m.hip;
    const gap=(shoulder-hip)/Math.max(shoulder,hip),wr=waist/hip; const type=wr>=.86?"O":gap>.055?"T":gap<-.055?"A":wr<=.78?"X":"H";
    const natural=[a.shoulderLine==="square",a.joints==="prominent",a.texture==="bony"].filter(Boolean).length;
    const straight=[a.upperBody==="thick",a.texture==="firm",a.center==="upper"].filter(Boolean).length;
    const frame=natural>=2?"NATURAL FRAME":straight>=2?"STRAIGHT FRAME":"WAVE FRAME"; const bmi=(+m.weight/((+m.height/100)**2)).toFixed(1);
    this.setData({bodyResult:{type,frame,bmi}}); try{await request("/api/assessments",{method:"POST",data:{kind:"body",bodyType:type,frameType:frame,bmi}});}catch(_){ }
  },
  profile(){wx.navigateTo({url:"/pages/profile/profile"});}
});
