"use client";

import { useEffect, useState } from "react";
import { ArrowRight, LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { BiText } from "@/components/caixiang/bi-text";

export type PreviewRole = "customer" | "admin";

const studioStories = [
  { image: "/studio-color-diagnosis.jpeg", eyebrow: "COLOR & STYLE", title: "나를 가장 돋보이게 하는 컬러와 스타일", titleZh: "找到真正衬你的颜色与风格", text: "퍼스널 컬러 진단과 4계절 12유형 세분화, 얼굴·스타일 분석을 통해 메이크업과 패션 컬러의 기준을 세워드려요.", textZh: "通过个人色彩诊断、四季十二型细分及面部风格定位，为妆发与服装用色建立依据。", tags: [["퍼스널 컬러 진단","个人色彩诊断"], ["개인 스타일 진단","个人风格诊断"]] },
  { image: "/studio-image-consulting.jpeg", eyebrow: "IMAGE DESIGN", title: "한 번의 조언을 오래가는 이미지 자산으로", titleZh: "把一次建议变成长期形象资产", text: "개인 이미지 디자인과 IP 브랜딩부터 옷장 관리, 쇼핑 동행까지 일상에서 실제로 활용할 수 있는 솔루션을 만듭니다.", textZh: "从个人形象设计、IP形象打造到衣橱管理与陪购，让方案真正落实到生活。", tags: [["IP 이미지 디자인","IP形象设计"], ["옷장 관리·쇼핑 동행","衣橱管理与陪购"]] },
  { image: "/studio-practice-course.jpeg", eyebrow: "COURSES", title: "연습을 통해 나만의 미학 기준을 만들어요", titleZh: "在练习中建立自己的审美方法", text: "스타일링 실습, 데일리 메이크업과 이미지 향상 수업을 통해 스스로 어울리는 표현을 완성하도록 도와드려요.", textZh: "通过穿搭实践、日常妆容与形象提升课程，独立完成适合自己的表达。", tags: [["스타일링 실습","穿搭实践"], ["데일리 메이크업 수업","日常妆容课程"]] },
  { image: "/studio-aesthetic-salon.jpeg", eyebrow: "SALON & COMMUNITY", title: "외적 이미지에서 더 풍요로운 삶으로", titleZh: "从外在形象走向更丰盛的生活", text: "이미지·라이프 미학과 예술 치유 살롱, 여성의 성장과 창업을 함께 나누는 커뮤니티를 운영합니다.", textZh: "开展形象美学、生活美学与艺术疗愈沙龙，以及女性成长和创业交流社群。", tags: [["미학 살롱","美学沙龙"], ["여성 성장 커뮤니티","女性成长社群"]] },
];

export function LoginGate({ onEnter }: { onEnter: (role: PreviewRole) => void }) {
  const [role, setRole] = useState<PreviewRole>("customer");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  const [entering, setEntering] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [slide, setSlide] = useState(0);
  const phoneReady = /^1\d{10}$/.test(phone);
  const canPreview = role === "admin" ? phoneReady : phoneReady && ageConfirmed && privacyConfirmed;

  useEffect(() => {
    void fetch("/api/session", { cache: "no-store" }).then((r) => r.json() as Promise<{ authenticated?: boolean; role?: PreviewRole }>).then((session) => {
      if (session.authenticated && session.role) onEnter(session.role);
    }).catch(() => undefined);
  }, [onEnter]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setSlide(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

  async function enter() {
    setEntering(true); setNotice("");
    try {
      const response = await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, role }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "登录失败");
      onEnter(role);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "登录失败，请稍后重试");
    } finally { setEntering(false); }
  }

  return <main className="min-h-screen bg-[#f7f7f2] text-[#151515]">
    <div className="grid min-h-screen lg:grid-cols-[1.03fr_.97fr]">
      <section className="relative block h-[58svh] overflow-hidden bg-[#151515] lg:h-auto">
        <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="h-full" aria-label="채상미학 오프라인 서비스 소개">
          <CarouselContent className="ml-0 h-[58svh] lg:h-screen">
            {studioStories.map((story) => <CarouselItem key={story.title} className="relative h-[58svh] pl-0 lg:h-screen">
              <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-12 xl:p-14">
                <p className="text-xs tracking-[.22em] text-white/65">{story.eyebrow} · NANJING</p>
                <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-[1.04] sm:text-4xl lg:mt-4 lg:text-5xl xl:text-6xl"><BiText ko={story.title} zh={story.titleZh}/></h1>
                <p className="mt-4 hidden max-w-xl leading-7 text-white/72 sm:block lg:mt-5"><BiText ko={story.text} zh={story.textZh} zhClassName="text-sm"/></p>
                <div className="mt-4 hidden flex-wrap gap-2 sm:flex lg:mt-6">{story.tags.map(([ko,zh]) => <span key={ko} className="rounded-full border border-white/30 bg-black/15 px-3 py-1.5 text-xs backdrop-blur"><BiText ko={ko} zh={zh}/></span>)}</div>
              </div>
            </CarouselItem>)}
          </CarouselContent>
          <div className="absolute left-6 top-6 z-10 flex items-center gap-3 text-white sm:left-8 sm:top-8 lg:left-12 lg:top-10"><span className="grid size-10 place-items-center rounded-full bg-white font-semibold text-black">彩</span><div><b className="font-serif text-lg">채상미학</b><p className="text-[9px] tracking-[.16em] text-white/60">彩相美学 · CAIXIANG LAB</p></div></div>
          <div className="absolute right-6 top-7 z-10 flex gap-2 sm:right-8 lg:bottom-12 lg:right-12 lg:top-auto">{studioStories.map((story, index) => <button key={story.title} type="button" aria-label={`${index + 1}번째 서비스 보기`} onClick={() => carouselApi?.scrollTo(index)} className={`h-1.5 rounded-full transition-all ${slide === index ? "w-9 bg-white" : "w-4 bg-white/40"}`}/>)}</div>
        </Carousel>
      </section>
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#151515] font-semibold text-white">彩</span><div><b className="font-serif text-xl">채상미학</b><p className="text-[10px] tracking-[.16em] text-black/45">彩相美学 · CAIXIANG LAB</p></div></div>
          <p className="text-xs font-semibold tracking-[.18em] text-[#dd3a3a]">PERSONAL AESTHETIC PROFILE</p>
          <h2 className="mt-3 font-serif text-4xl"><BiText ko="나의 이미지 프로필 로그인" zh="登录你的形象档案"/></h2>
          <p className="mt-3 leading-7 text-black/52"><BiText ko="휴대전화 번호로 본인을 확인합니다. 진단 결과와 디지털 이미지 사진은 본인 계정에 안전하게 저장됩니다." zh="使用手机号确认身份；初测结果与数字形象照片会安全保存到本人账户。" zhClassName="text-sm"/></p>

          <Tabs value={role} onValueChange={(value) => { setRole(value as PreviewRole); setNotice(""); }} className="mt-8">
            <TabsList className="grid h-14 w-full grid-cols-2 rounded-full bg-[#e9e8e2] p-1"><TabsTrigger className="rounded-full" value="customer"><BiText ko="고객 로그인" zh="客户登录"/></TabsTrigger><TabsTrigger className="rounded-full" value="admin"><BiText ko="관리자 로그인" zh="管理员登录"/></TabsTrigger></TabsList>
          </Tabs>

          <div className="mt-7 space-y-5">
            <label><span className="mb-2 block text-sm"><BiText ko="휴대전화 번호" zh="手机号"/></span><div className="flex gap-2"><div className="relative min-w-0 flex-1"><span className="absolute left-4 top-3.5 text-sm text-black/40">+86</span><Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} inputMode="tel" className="h-12 rounded-xl pl-14" placeholder="11자리 중국 휴대전화 번호" /></div><Button variant="outline" className="h-12 shrink-0 rounded-xl px-3" disabled={!phoneReady} onClick={() => setNotice("문자 인증 연결을 위한 자리는 준비되어 있습니다. 서비스 제공업체 연결 후 실제 인증번호가 발송됩니다.｜页面已预留短信接口，接入服务商后才会真实发送验证码。")}>인증번호<br/><small className="text-[10px] opacity-50">获取验证码</small></Button></div></label>
            <label><span className="mb-2 block text-sm"><BiText ko="인증번호" zh="验证码"/></span><InputOTP maxLength={6} value={otp} onChange={setOtp} disabled containerClassName="w-full"><InputOTPGroup className="grid w-full grid-cols-6">{[0,1,2,3,4,5].map((index) => <InputOTPSlot key={index} index={index} className="h-12 w-full bg-white" />)}</InputOTPGroup></InputOTP><span className="mt-2 block text-xs text-black/38"><BiText ko="문자 인증 서비스 연결 전에는 입력할 수 없습니다" zh="短信服务接入前暂不可填写"/></span></label>
          </div>

          {role === "customer" && <div className="mt-6 space-y-4 rounded-2xl bg-white p-5 text-sm">
            <label className="flex cursor-pointer items-start gap-3"><Checkbox checked={ageConfirmed} onCheckedChange={(value) => setAgeConfirmed(value === true)} className="mt-0.5"/><BiText ko="만 14세 이상임을 확인합니다" zh="我确认已满14周岁"/></label>
            <label className="flex cursor-pointer items-start gap-3"><Checkbox checked={privacyConfirmed} onCheckedChange={(value) => setPrivacyConfirmed(value === true)} className="mt-0.5"/><span className="leading-6"><BiText ko="「개인정보 처리방침」과 「사진·진단 데이터 처리 안내」를 읽고 동의합니다" zh="我已阅读并同意《隐私政策》和《照片与测试数据处理说明》"/></span></label>
          </div>}
          {role === "admin" && <div className="mt-6 flex gap-3 rounded-2xl border border-[#174ea6]/20 bg-[#174ea6]/5 p-4 text-sm leading-6 text-[#174ea6]"><LockKeyhole className="mt-0.5 size-5 shrink-0"/><BiText ko="정식 오픈 후에는 미리 등록된 관리자 휴대전화 번호만 고객 데이터베이스에 접근할 수 있습니다." zh="正式上线后，只有预先配置的管理员手机号可以进入客户数据库。"/></div>}
          {notice && <p className="mt-4 flex gap-2 rounded-xl bg-[#f1dedb] p-3 text-sm text-[#8b2c28]"><MessageSquareText className="size-4 shrink-0"/>{notice}</p>}
          <Button disabled={!canPreview || entering} onClick={() => void enter()} className="mt-6 h-14 w-full rounded-full bg-[#151515] text-white"><BiText ko={entering ? "로그인 중" : "비공개 페이지 미리보기"} zh={entering ? "正在登录" : "进入私密页面预览"}/> <ArrowRight/></Button>
          <p className="mt-5 flex items-start justify-center gap-2 text-xs text-black/38"><ShieldCheck className="mt-0.5 size-4 shrink-0"/><BiText ko="현재 진단 결과와 동의 후 업로드한 사진을 저장합니다. 문자 인증은 서비스 제공업체 연결 후 활성화됩니다." zh="当前会保存测试结果及经同意上传的照片；短信验证将在接入服务商后启用。"/></p>
        </div>
      </section>
    </div>
  </main>;
}
