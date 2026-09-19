"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import { BiText } from "@/components/caixiang/bi-text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const [selected, setSelected] = useState<{ name: string; nameZh: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setSubmitting(true); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        serviceName: selected.nameZh,
        contactName: form.get("contactName"),
        contactMethod: form.get("contactMethod"),
        preferredDate: form.get("preferredDate"),
        preferredTime: form.get("preferredTime"),
        city: form.get("city"),
        note: form.get("note"),
      }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "预约提交失败");
      setSuccess(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "预约提交失败，请稍后重试"); }
    finally { setSubmitting(false); }
  }

  return <section id="pricing" className="scroll-mt-20 bg-[#e9e8e2] px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto max-w-7xl">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold tracking-[.18em] text-[#dd3a3a]">XIANLIN STUDIO PRICE LIST</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl"><BiText ko="난징 셴린 스튜디오 가격표" zh="南京仙林工作室价目表"/></h2></div><p className="max-w-md text-sm leading-6 text-black/48"><BiText ko="모든 가격은 중국 위안화(RMB) 기준입니다. 공유가와 회원가 혜택은 다른 할인과 중복 적용되지 않으며, 예약 시 안내되는 규정을 기준으로 합니다." zh="价格单位为人民币。分享价、会员价及相关权益不与其他优惠同时使用，具体以预约时的活动规则为准。"/></p></div>
    <div className="mt-10 space-y-5">{groups.map((group) => <article key={group.en} className="overflow-hidden rounded-[1.6rem] bg-white"><div className="flex flex-col justify-between gap-3 border-b border-black/10 p-6 sm:flex-row sm:items-end sm:p-8"><div><span className="text-xs tracking-[.18em] text-black/35">{group.en}</span><h3 className="mt-2 font-serif text-3xl"><BiText ko={group.name} zh={group.nameZh}/></h3></div><p className="text-sm text-black/45"><BiText ko={group.description} zh={group.descriptionZh}/></p></div><div>{group.services.map(([name, nameZh, original, sharing, member]) => <div key={name} className="border-t border-black/[.07] px-6 py-6 first:border-t-0 sm:px-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0 lg:w-[34%]"><h4 className="font-serif text-xl"><BiText ko={name} zh={nameZh}/></h4></div><div className="grid grid-cols-3 gap-2 lg:w-[38%]">{[["정가","原价",original],["공유가","分享价",sharing],["회원가","会员价",member]].map(([label,labelZh,price],index) => <div key={String(label)} className={`rounded-xl p-3 text-center ${index === 1 ? "bg-[#f8e9e7] text-[#b93434]" : "bg-[#f5f5f1]"}`}><span className="block text-[10px] opacity-55"><BiText ko={label} zh={labelZh}/></span><b className="mt-2 block text-lg">¥{price}</b></div>)}</div><Button onClick={() => { setSelected({name,nameZh}); setSuccess(false); setMessage(""); }} className="h-12 rounded-full bg-[#151515] px-6 text-white lg:w-[18%]"><BiText ko="예약하기" zh="立即预约"/><ArrowRight/></Button></div></div>)}</div></article>)}</div>
    <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2"><p className="flex gap-3 rounded-2xl bg-white/60 p-5 leading-6"><Check className="mt-1 size-4 shrink-0 text-[#dd3a3a]"/><BiText ko="첫 예약 후 위챗 모먼트, 샤오홍슈 또는 더우인에 실제 체험 후기를 공유하면 공유가가 적용됩니다." zh="首次预约后，在朋友圈、小红书或抖音分享真实体验，可享分享价。"/></p><p className="flex gap-3 rounded-2xl bg-white/60 p-5 leading-6"><Check className="mt-1 size-4 shrink-0 text-[#dd3a3a]"/><BiText ko="첫 서비스를 완료하면 자동으로 회원이 되어 이후 서비스의 회원가와 이벤트 우선권을 받을 수 있습니다." zh="完成首次服务后自动成为会员，后续服务享会员价和活动优先权。"/></p></div>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="max-h-[92svh] overflow-y-auto rounded-[1.6rem] p-0 sm:max-w-xl"><div className="bg-[#174ea6] p-6 text-white sm:p-8"><DialogHeader><p className="text-xs tracking-[.18em] text-white/55">APPOINTMENT</p><DialogTitle className="mt-2 font-serif text-3xl"><BiText ko="서비스 예약" zh="预约服务"/></DialogTitle><DialogDescription className="text-white/65"><BiText ko={selected?.name ?? ""} zh={selected?.nameZh ?? ""}/></DialogDescription></DialogHeader></div>{success ? <div className="p-8 text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#174ea6] text-2xl text-white">✓</span><h3 className="mt-5 font-serif text-2xl"><BiText ko="예약 신청이 완료되었어요" zh="预约申请已提交"/></h3><p className="mt-3 text-sm leading-6 text-black/50">工作人员确认时间后，会通过你填写的联系方式联系你。</p><Button onClick={() => setSelected(null)} className="mt-6 w-full rounded-full">完成</Button></div> : <form onSubmit={submit} className="space-y-5 p-6 sm:p-8"><Field label="姓名"><Input name="contactName" required placeholder="请输入姓名" className="h-12"/></Field><Field label="微信号或手机号"><Input name="contactMethod" required placeholder="用于确认预约" className="h-12"/></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="期望日期"><Input name="preferredDate" type="date" required className="h-12"/></Field><Field label="期望时段"><select name="preferredTime" required className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option>10:00–12:00</option><option>13:00–15:00</option><option>15:00–17:00</option><option>17:00–19:00</option></select></Field></div><Field label="服务地点"><select name="city" required className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option>南京仙林工作室</option><option>无锡（预约确认地点）</option><option>线上咨询</option></select></Field><Field label="补充说明（选填）"><Textarea name="note" maxLength={300} placeholder="如同行人数、希望解决的问题等" className="min-h-28"/></Field>{message && <p className="rounded-xl bg-[#f8e9e7] p-3 text-sm text-[#9d3434]">{message}</p>}<Button type="submit" disabled={submitting} className="h-13 w-full rounded-full bg-[#151515] text-white"><CalendarDays/>{submitting ? "正在提交…" : "提交预约"}</Button><p className="text-center text-xs leading-5 text-black/35">提交即表示同意以上信息仅用于本次预约联系。</p></form>}</DialogContent></Dialog>
  </div></section>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>; }
