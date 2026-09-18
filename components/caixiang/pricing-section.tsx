import { Check } from "lucide-react";
import { BiText } from "@/components/caixiang/bi-text";

const groups = [
  { name: "베이직 체험", nameZh: "体验系列", en: "BASIC", description: "기본 컬러 특성을 빠르게 확인해요", descriptionZh: "快速判断基础色彩属性", services: [
    ["4계절 퍼스널 컬러 간이 진단", "四季色彩快速检测", 239, 189, 159], ["메이크업·헤어 컬러 간이 진단", "妆发色彩快速测试", 299, 239, 199],
  ]},
  { name: "이미지 디자인", nameZh: "设计系列", en: "DESIGN", description: "더 완성도 높은 개인 이미지 솔루션", descriptionZh: "形成更完整的个人形象方案", services: [
    ["개인 컬러 활용 기준", "个人用色规律", 880, 680, 580], ["개인 스타일 구축", "个人风格建立", 880, 680, 580], ["개인 이미지 맞춤 디자인", "个人形象定制", 1380, 1080, 880],
  ]},
  { name: "시그니처 케어", nameZh: "甄选系列", en: "SIGNATURE", description: "개인 이미지와 옷장을 지속적으로 관리해요", descriptionZh: "持续管理个人形象与衣橱", services: [
    ["시즌 쇼핑 동행", "单季陪购", 799, 599, 499], ["시즌 옷장 관리", "单季衣橱管理", 1280, 980, 880], ["분기별 이미지 케어", "季度形象陪伴", 1580, 1280, 1080], ["프리미엄 개인 이미지 컨시어지", "高级私人形象管家", 3980, 2980, 2680],
  ]},
] as const;

export function PricingSection() {
  return <section id="pricing" className="scroll-mt-20 bg-[#e9e8e2] px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto max-w-7xl">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold tracking-[.18em] text-[#dd3a3a]">XIANLIN STUDIO PRICE LIST</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl"><BiText ko="난징 셴린 스튜디오 가격표" zh="南京仙林工作室价目表"/></h2></div><p className="max-w-md text-sm leading-6 text-black/48"><BiText ko="모든 가격은 중국 위안화(RMB) 기준입니다. 공유가와 회원가 혜택은 다른 할인과 중복 적용되지 않으며, 예약 시 안내되는 규정을 기준으로 합니다." zh="价格单位为人民币。分享价、会员价及相关权益不与其他优惠同时使用，具体以预约时的活动规则为准。"/></p></div>
    <div className="mt-10 space-y-5">{groups.map((group) => <article key={group.en} className="overflow-hidden rounded-[1.6rem] bg-white"><div className="flex flex-col justify-between gap-3 border-b border-black/10 p-6 sm:flex-row sm:items-end sm:p-8"><div><span className="text-xs tracking-[.18em] text-black/35">{group.en}</span><h3 className="mt-2 font-serif text-3xl"><BiText ko={group.name} zh={group.nameZh}/></h3></div><p className="text-sm text-black/45"><BiText ko={group.description} zh={group.descriptionZh}/></p></div><div className="overflow-x-auto"><table className="w-full min-w-[660px] text-left"><thead className="text-xs text-black/40"><tr><th className="px-6 py-4 font-normal sm:px-8"><BiText ko="서비스" zh="服务项目"/></th><th className="px-4 py-4 font-normal"><BiText ko="정가" zh="原价"/></th><th className="px-4 py-4 font-normal text-[#dd3a3a]"><BiText ko="공유가" zh="分享价"/></th><th className="px-6 py-4 font-normal sm:px-8"><BiText ko="회원가" zh="会员价"/></th></tr></thead><tbody>{group.services.map(([name, nameZh, original, sharing, member]) => <tr key={name} className="border-t border-black/[.07]"><td className="px-6 py-5 font-medium sm:px-8"><BiText ko={name} zh={nameZh}/></td><td className="px-4 py-5 text-black/48">¥{original}</td><td className="px-4 py-5 font-semibold text-[#dd3a3a]">¥{sharing}</td><td className="px-6 py-5 font-semibold sm:px-8">¥{member}</td></tr>)}</tbody></table></div></article>)}</div>
    <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2"><p className="flex gap-3 rounded-2xl bg-white/60 p-5 leading-6"><Check className="mt-1 size-4 shrink-0 text-[#dd3a3a]"/><BiText ko="첫 예약 후 위챗 모먼트, 샤오홍슈 또는 더우인에 실제 체험 후기를 공유하면 공유가가 적용됩니다." zh="首次预约后，在朋友圈、小红书或抖音分享真实体验，可享分享价。"/></p><p className="flex gap-3 rounded-2xl bg-white/60 p-5 leading-6"><Check className="mt-1 size-4 shrink-0 text-[#dd3a3a]"/><BiText ko="첫 서비스를 완료하면 자동으로 회원이 되어 이후 서비스의 회원가와 이벤트 우선권을 받을 수 있습니다." zh="完成首次服务后自动成为会员，后续服务享会员价和活动优先权。"/></p></div>
  </div></section>;
}
