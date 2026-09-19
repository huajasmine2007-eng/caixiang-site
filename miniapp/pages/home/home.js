Page({
  data: { modules: [
    { no:"01", path:"assessment", ko:"온라인 간이 진단", zh:"线上初测", copy:"사진과 신체 데이터를 입력하고 이전 결과도 확인해요" },
    { no:"02", path:"profile", ko:"디지털 이미지 프로필", zh:"数字形象档案", copy:"전신과 얼굴 세 방향 사진으로 정밀한 프로필을 준비해요" },
    { no:"03", path:"studio", ko:"오프라인 스튜디오", zh:"线下工作室", copy:"서비스와 세 명의 창립자를 확인해요" },
    { no:"04", path:"pricing", ko:"서비스 가격", zh:"服务价格", copy:"체험·디자인·이미지 관리 가격표" }
  ]},
  open(e) { wx.navigateTo({ url:`/pages/${e.currentTarget.dataset.path}/${e.currentTarget.dataset.path}` }); },
  history() { wx.navigateTo({ url:"/pages/history/history" }); }
});
