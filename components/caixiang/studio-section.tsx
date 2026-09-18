import { Clock3, MapPin } from "lucide-react";
import { BiText } from "@/components/caixiang/bi-text";

const services = [
  { image: "/service-color.jpeg", title: "퍼스널 컬러 진단", titleZh: "个人色彩诊断", en: "PERSONAL COLOR", text: "전문 드레이프 천으로 웜·쿨, 명도와 채도를 비교해 나만의 컬러 기준을 만들어요.", textZh: "通过专业色布对比冷暖、明度与饱和度，建立个人用色规律。" },
  { image: "/service-style.jpeg", title: "개인 스타일 진단", titleZh: "个人风格诊断", en: "PERSONAL STYLE", text: "얼굴, 체형, 존재감과 선을 함께 분석해 8가지 스타일 방향을 찾아드려요.", textZh: "结合面部、身材、量感与线条，确定八大风格方向。" },
  { image: "/service-ip.jpeg", title: "이미지 디자인·IP 브랜딩", titleZh: "形象设计与 IP 打造", en: "IMAGE DESIGN", text: "메이크업, 헤어, 의상과 상황별 표현을 하나의 선명한 개인 이미지로 연결해요.", textZh: "让妆发、服装与场景表达形成清晰统一的个人识别。" },
  { image: "/service-assets.jpeg", title: "이미지 자산 관리", titleZh: "形象资产管理", en: "IMAGE ASSETS", text: "옷장 관리, 쇼핑 동행과 시즌별 이미지 케어로 가지고 있는 아이템을 더 잘 활용해요.", textZh: "衣橱管理、陪购与季度形象陪伴，让每件单品更有效。" },
  { image: "/service-outfit.jpeg", title: "스타일링 실습 수업", titleZh: "穿搭实践课程", en: "STYLING COURSE", text: "컬러 매칭, TPO, 실루엣 판단과 캡슐 옷장 구성법을 연습해요.", textZh: "练习色彩搭配、TPO、版型判断与胶囊衣橱方法。" },
  { image: "/service-makeup.jpeg", title: "데일리 메이크업 수업", titleZh: "日常妆容课程", en: "DAILY MAKEUP", text: "개인의 피부 톤과 스타일을 바탕으로 일상에 어울리는 메이크업과 헤어를 연습해요.", textZh: "从个人肤色和风格出发，练习适合日常的妆发表达。" },
  { image: "/service-growth.jpeg", title: "이미지 향상 수업", titleZh: "形象提升课程", en: "IMAGE GROWTH", text: "직접 입어 보고 조정하며 복습해 오래 활용할 수 있는 미학 기준을 만들어요.", textZh: "通过试穿、调整与复盘，建立可以持续使用的审美方法。" },
  { image: "/service-salon.jpeg", title: "미학 살롱·여성 커뮤니티", titleZh: "美学沙龙与女性社群", en: "SALON & COMMUNITY", text: "이미지, 라이프 미학과 예술 치유를 주제로 여성의 성장과 경험을 함께 나눠요.", textZh: "开展形象、生活与艺术疗愈主题，以及女性成长交流。" },
];

const founders = [
  { image: "/founder-qiubo.jpeg", imagePosition: "68% 24%", name: "추보", nameZh: "秋波", role: "창립자", roleZh: "创始人", en: "QIU BO", copy: "패션 전 채널 분야에서 15년간 활동한 시니어 이미지 매니저이자 AICI 회원입니다. 중국인민대학교 경영학 석사이며 일본어·교육학 복수 학위를 보유하고 있습니다.", copyZh: "15年全渠道服装行业经验，高级形象管理师、AICI会员。中国人民大学工商管理硕士，日语与教育学双学位。" },
  { image: "/founder-jingman.jpeg", imagePosition: "66% 22%", name: "징만", nameZh: "景曼", role: "창립자", roleZh: "创始人", en: "JASMINE", copy: "난징재경대학교 메시칼리지 금융공학 전공, 아트 디자인 부전공. JPCA 전문 컬러 진단사이며 한국 퍼스널 컬러·개인 이미지 진단 과정을 이수했습니다.", copyZh: "南京财经大学梅西学院金融工程专业，辅修艺术设计。JPCA专业色彩诊断师，韩国个人色彩与个人形象诊断认证。" },
  { image: "/founder-jieyu.jpeg", imagePosition: "50% 24%", name: "제위", nameZh: "洁玉", role: "공동 창립자", roleZh: "联合创始人", en: "JIE YU", copy: "일본계 기업 재무·내부 운영 분야에서 13년간 활동했습니다. 시니어 이미지 매니저이자 가정 재무설계사로 개인과 단체의 이미지 자산 관리에 집중합니다.", copyZh: "13年日企财会与内部运营管理经验，高级形象管理师、家庭理财规划师，专注个人与团体形象资产管理。" },
];

export function StudioSection() {
  return <section id="studio" className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 lg:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div><p className="text-xs font-semibold tracking-[.18em] text-[#dd3a3a]">NANJING · XIANLIN</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl"><BiText ko="채상미학 오프라인 스튜디오" zh="彩相美学线下工作室"/></h2></div>
        <div><p className="max-w-2xl leading-8 text-black/58"><BiText ko="컬러와 스타일 진단을 시작으로 메이크업, 스타일링, 옷장 관리와 개인 이미지 디자인까지 이어집니다. 모든 서비스는 실제 오프라인 체험과 실습 과정으로 구성됩니다." zh="从色彩与风格诊断出发，继续完成妆容、穿搭、衣橱管理与个人形象设计。每项服务都对应真实的线下体验和实践过程。" zhClassName="text-sm"/></p><div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:gap-8"><p className="flex items-start gap-3"><MapPin className="mt-1 size-5 shrink-0 text-[#174ea6]"/><BiText ko="난징재경대학교 셴린캠퍼스 창업원 213" zh="南京财经大学仙林校区创业园 213"/></p><p className="flex items-start gap-3"><Clock3 className="mt-1 size-5 shrink-0 text-[#174ea6]"/><BiText ko="09:00—21:00 · 예약제" zh="9:00—21:00 · 预约制"/></p></div></div>
      </div>

      <div className="mt-12 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">{services.map((service,index) => <StudioItem key={service.title} {...service} index={index+1}/>)}</div>

      <div className="mt-20 border-t border-black/10 pt-14"><div className="max-w-2xl"><p className="text-xs font-semibold tracking-[.18em] text-[#dd3a3a]">FOUNDING TEAM</p><h3 className="mt-3 font-serif text-4xl"><BiText ko="세 명의 창립자가 전문성과 운영을 함께 완성합니다" zh="三位创始人，共同完成专业与运营"/></h3></div><div className="mt-9 grid gap-5 lg:grid-cols-3">{founders.map((founder) => <Founder key={founder.name} {...founder}/>)}</div></div>
    </div>
  </section>;
}

function StudioItem({ image, title, titleZh, en, text, textZh, index }: { image: string; title: string; titleZh: string; en: string; text: string; textZh: string; index: number }) { return <article className="group"><div className="overflow-hidden rounded-[1.4rem] bg-[#e9e8e2]"><img src={image} alt={`${title} 오프라인 서비스 사진`} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"/></div><div className="mt-4 flex gap-3"><span className="pt-1 text-xs text-black/32">{String(index).padStart(2,"0")}</span><div><p className="text-[11px] tracking-[.14em] text-[#174ea6]">{en}</p><h3 className="mt-1 font-serif text-xl"><BiText ko={title} zh={titleZh}/></h3><p className="mt-2 text-sm leading-6 text-black/52"><BiText ko={text} zh={textZh}/></p></div></div></article>; }

function Founder({ image, imagePosition, name, nameZh, role, roleZh, en, copy, copyZh }: { image: string; imagePosition: string; name: string; nameZh: string; role: string; roleZh: string; en: string; copy: string; copyZh: string }) { return <article className="grid grid-cols-[110px_1fr] gap-4 rounded-[1.5rem] bg-[#151515] p-5 text-white sm:grid-cols-[145px_1fr] sm:gap-5"><img src={image} alt={`${name} 프로필 사진`} className="aspect-[3/4] h-full w-full rounded-xl object-cover" style={{ objectPosition: imagePosition }}/><div className="py-2"><p className="text-[10px] tracking-[.16em] text-[#ef6d64]">{en} · <BiText ko={role} zh={roleZh} inline/></p><h4 className="mt-2 font-serif text-3xl"><BiText ko={name} zh={nameZh}/></h4><p className="mt-4 text-sm leading-6 text-white/62"><BiText ko={copy} zh={copyZh}/></p></div></article>; }
