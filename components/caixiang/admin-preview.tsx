"use client";
import { useState } from "react";
import { ArrowLeft, Database, Image as ImageIcon, Phone, Search, ShieldCheck, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiText } from "@/components/caixiang/bi-text";

export function AdminPreview({ onExit }: { onExit: () => void }) {
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  async function importProducts(file?: File) {
    if (!file) return;
    setImporting(true); setImportMessage("");
    const formData = new FormData(); formData.append("file", file);
    try {
      const response = await fetch("/api/products/import", { method: "POST", body: formData });
      const data = await response.json() as { error?: string; imported?: number };
      if (!response.ok) throw new Error(data.error);
      setImportMessage(`상품 ${data.imported ?? 0}개를 가져왔습니다｜已导入 ${data.imported ?? 0} 件商品`);
    } catch (error) { setImportMessage(error instanceof Error ? error.message : "导入失败，请稍后重试"); }
    finally { setImporting(false); }
  }
  return <main className="min-h-screen bg-[#f3f3ef] text-[#151515]"><header className="border-b border-black/10 bg-white"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-5 py-2 sm:px-8"><div className="flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-black text-xs text-white">彩</span><b><BiText ko="채상미학 고객 관리" zh="彩相美学客户后台"/></b></div><Button variant="ghost" onClick={onExit}><ArrowLeft/><BiText ko="종료" zh="退出"/></Button></div></header>
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs tracking-[.16em] text-black/40">CUSTOMER DATABASE</p><h1 className="mt-2 font-serif text-4xl"><BiText ko="고객 프로필" zh="客户档案"/></h1></div><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-2.5 size-4 text-black/35"/><Input className="pl-9" placeholder="휴대전화·이름·결과 검색｜搜索手机号、姓名或结果" disabled/></div></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3"><AdminStat icon={<Users/>} label="전체 고객" labelZh="客户总数" value="0"/><AdminStat icon={<ImageIcon/>} label="저장된 사진" labelZh="已保存照片" value="0"/><AdminStat icon={<Database/>} label="완료된 진단" labelZh="已完成测试" value="0"/></div>
      <section className="mt-7 overflow-hidden rounded-[1.4rem] border border-black/10 bg-white"><div className="overflow-x-auto"><div className="grid min-w-[760px] grid-cols-[1.1fr_1fr_.9fr_1fr_.8fr] border-b border-black/10 bg-[#f8f8f5] px-6 py-4 text-xs text-black/38"><BiText ko="고객 / 계정" zh="客户 / 账户"/><BiText ko="사진 자료" zh="照片资料"/><BiText ko="컬러 결과" zh="色彩结果"/><BiText ko="체형·골격" zh="体型骨骼"/><BiText ko="최근 업데이트" zh="最近更新"/></div></div><div className="grid min-h-60 place-items-center p-8 text-center"><div><div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9e8e2]"><Database className="size-6 text-black/35"/></div><h2 className="mt-5 font-serif text-2xl"><BiText ko="고객 데이터베이스가 연결되었습니다" zh="客户数据库已接入"/></h2><p className="mt-2 max-w-md text-sm leading-6 text-black/48"><BiText ko="현재 고객별 초기 진단 결과와 디지털 이미지 프로필 사진이 저장됩니다. 고객 목록 검색과 상세 관리 화면은 다음 관리 기능에서 확장됩니다." zh="当前已保存客户的线上初测结果与数字形象档案照片；客户搜索与详情管理将在下一版后台继续扩展。"/></p></div></div></section>
      <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-black/10 bg-white p-6"><p className="flex items-start gap-2 font-medium"><Phone className="mt-1 size-5 shrink-0 text-[#174ea6]"/><BiText ko="관리자 휴대전화 번호" zh="管理员手机号"/></p><p className="mt-3 text-sm leading-6 text-black/48"><BiText ko="문자 인증 서비스 연결 시 설정합니다." zh="正式接入短信服务时配置。"/></p></div><div className="rounded-2xl border border-black/10 bg-white p-6"><p className="flex items-start gap-2 font-medium"><ShieldCheck className="mt-1 size-5 shrink-0 text-[#174ea6]"/><BiText ko="데이터 접근 권한" zh="数据权限"/></p><p className="mt-3 text-sm leading-6 text-black/48"><BiText ko="고객은 본인의 기록만 확인합니다." zh="客户只能查看自己的记录。"/></p></div><label className="cursor-pointer rounded-2xl border border-[#174ea6]/25 bg-[#174ea6]/5 p-6"><p className="flex items-start gap-2 font-medium text-[#174ea6]"><Upload className="mt-1 size-5 shrink-0"/><BiText ko="상품 데이터 추가" zh="导入衣物商品数据"/></p><p className="mt-3 text-sm leading-6 text-black/48"><BiText ko="CSV 파일로 브랜드와 상품을 최대 500개씩 추가하거나 갱신합니다." zh="通过 CSV 每次新增或更新最多 500 件商品。"/></p><span className="mt-4 block text-sm font-medium">{importing ? "가져오는 중｜正在导入" : "CSV 선택｜选择 CSV"}</span><input type="file" accept=".csv,text/csv" className="sr-only" disabled={importing} onChange={(e) => void importProducts(e.target.files?.[0])}/>{importMessage && <span className="mt-3 block text-xs text-[#174ea6]">{importMessage}</span>}</label></div>
    </div></main>;
}
function AdminStat({ icon, label, labelZh, value }: { icon: React.ReactNode; label: string; labelZh: string; value: string }) { return <div className="rounded-2xl border border-black/10 bg-white p-6"><span className="text-[#dd3a3a] [&_svg]:size-5">{icon}</span><b className="mt-6 block font-serif text-4xl">{value}</b><span className="mt-1 block text-sm text-black/45"><BiText ko={label} zh={labelZh}/></span></div>; }
