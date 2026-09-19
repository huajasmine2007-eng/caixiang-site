Page({
  data:{groups:[
    {ko:"베이직 체험",zh:"体验系列",items:[
      {ko:"4계절 퍼스널 컬러 간이 진단",name:"四季色彩快速检测",original:239,sharing:189,member:159},
      {ko:"메이크업·헤어 컬러 간이 진단",name:"妆发色彩快速测试",original:299,sharing:239,member:199}
    ]},
    {ko:"이미지 디자인",zh:"设计系列",items:[
      {ko:"개인 컬러 활용 기준",name:"个人用色规律",original:880,sharing:680,member:580},
      {ko:"개인 스타일 구축",name:"个人风格建立",original:880,sharing:680,member:580},
      {ko:"개인 이미지 맞춤 디자인",name:"个人形象定制",original:1380,sharing:1080,member:880}
    ]},
    {ko:"시그니처 케어",zh:"甄选系列",items:[
      {ko:"시즌 쇼핑 동행",name:"单季陪购",original:799,sharing:599,member:499},
      {ko:"시즌 옷장 관리",name:"单季衣橱管理",original:1280,sharing:980,member:880},
      {ko:"분기별 이미지 케어",name:"季度形象陪伴",original:1580,sharing:1280,member:1080},
      {ko:"프리미엄 개인 이미지 컨시어지",name:"高级私人形象管家",original:3980,sharing:2980,member:2680}
    ]}
  ]},
  book(e){
    const service = encodeURIComponent(e.currentTarget.dataset.service);
    wx.navigateTo({url:`/pages/booking/booking?service=${service}`});
  }
});
