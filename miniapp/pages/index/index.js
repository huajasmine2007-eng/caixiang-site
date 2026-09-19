Page({
  data: {
    current: 0,
    slides: [
      { image: "https://caixianglab.online/studio-color-diagnosis.jpeg", tag: "COLOR & STYLE", ko: "나를 가장 돋보이게 하는 컬러", zh: "找到真正衬你的颜色与风格" },
      { image: "https://caixianglab.online/studio-image-consulting.jpeg", tag: "IMAGE DESIGN", ko: "이미지를 오래가는 자산으로", zh: "把一次建议变成长期形象资产" },
      { image: "https://caixianglab.online/studio-practice-course.jpeg", tag: "COURSES", ko: "나만의 미학 기준을 만들어요", zh: "建立属于自己的审美方法" }
    ]
  },
  change(e) { this.setData({ current: e.detail.current }); },
  enter() { wx.reLaunch({ url: "/pages/home/home" }); }
});
