"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Database, Image as ImageIcon, Phone, RefreshCw, Search, ShieldCheck, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiText } from "@/components/caixiang/bi-text";

type AdminRecord = {
  id: string;
  phone: string;
  kind: "color" | "body" | "combined";
  colorSeason?: string | null;
  twelveType?: string | null;
  colorType?: string | null;
  styleType?: string | null;
  bodyType?: string | null;
  frameType?: string | null;
  bmi?: string | null;
  photoCount: string | number;
  createdAt: string | number;
};

type AdminData = {
  stats: { customers: number; photos: number; assessments: number };
  records: AdminRecord[];
};

const emptyData: AdminData = { stats: { customers: 0, photos: 0, assessments: 0 }, records: [] };

function kindLabel(kind: AdminRecord["kind"]) {
  if (kind === "color") return "퍼스널 컬러｜色彩测试";
  if (kind === "body") return "체형·골격｜体型骨骼";
  return "종합 진단｜综合测试";
}

function resultSummary(record: AdminRecord) {
  const values = [record.twelveType || record.colorSeason, record.colorType, record.styleType, record.bodyType, record.frameType].filter(Boolean);
  return values.length ? values.join(" · ") : "결과 저장됨｜结果已保存";
}

function formatTime(value: string | number) {
  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

export function AdminPreview({ onExit }: { onExit: () => void }) {
  const [data, setData] = useState<AdminData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  async function loadRecords() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/records", { cache: "no-store" });
      const body = await response.json() as AdminData & { error?: string };
      if (!response.ok) throw new Error(body.error || "读取失败");
      setData(body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "后台记录暂时无法读取");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/admin/records", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const body = await response.json() as AdminData & { error?: string };
        if (!response.ok) throw new Error(body.error || "读取失败");
        return body;
      })
      .then((body) => setData(body))
      .catch((cause) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "后台记录暂时无法读取");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const records = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return data.records;
    return data.records.filter((record) => `${record.phone} ${kindLabel(record.kind)} ${resultSummary(record)}`.toLowerCase().includes(keyword));
  }, [data.records, query]);

  async function importProducts(file?: File) {
    if (!file) return;
    setImporting(true); setImportMessage("");
    const formData = new FormData(); formData.append("file", file);
    try {
      const response = await fetch("/api/products/import", { method: "POST", body: formData });
      const body = await response.json() as { error?: string; imported?: number };
      if (!response.ok) throw new Error(body.error);
      setImportMessage(`상품 ${body.imported ?? 0}개를 가져왔습니다｜已导入 ${body.imported ?? 0} 件商品`);
    } catch (cause) { setImportMessage(cause instanceof Error ? cause.message : "导入失败，请稍后重试"); }
    finally { setImporting(false); }
  }

  return <main className="min-h-screen bg-[#f3f3ef] text-[#151515]">
    <header className="border-b border-black/10 bg-white"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-5 py-2 sm:px-8"><div className="flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-black text-xs text-white">彩</span><b><BiText ko="채상미학 고객 관리" zh="彩相美学客户后台"/></b></div><Button variant="ghost" onClick={onExit}><ArrowLeft/><BiText ko="종료" zh="退出"/></Button></div></header>
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs tracking-[.16em] text-black/40">CUSTOMER DATABASE</p><h1 className="mt-2 font-serif text-4xl"><BiText ko="진단 기록" zh="测试记录"/></h1></div><div className="flex w-full max-w-md gap-2"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-2.5 size-4 text-black/35"/><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="휴대전화·결과 검색｜搜索手机号或结果"/></div><Button variant="outline" size="icon" onClick={() => void loadRecords()} disabled={loading} aria-label="刷新"><RefreshCw className={loading ? "animate-spin" : ""}/></Button></div></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3"><AdminStat icon={<Users/>} label="전체 고객" labelZh="客户总数" value={data.stats.customers}/><AdminStat icon={<ImageIcon/>} label="저장된 사진" labelZh="已保存照片" value={data.stats.photos}/><AdminStat icon={<Database/>} label="완료된 진단" labelZh="已完成测试" value={data.stats.assessments}/></div>

      <section className="mt-7 overflow-hidden rounded-[1.4rem] border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6"><b><BiText ko="최근 진단" zh="最近测试记录"/></b><span className="text-xs text-black/40"><BiText ko={`총 ${records.length}건`} zh={`共 ${records.length} 条`}/></span></div>
        {error ? <div className="grid min-h-52 place-items-center p-8 text-center"><div><ShieldCheck className="mx-auto size-7 text-[#dd3a3a]"/><p className="mt-3 text-sm text-[#8b2c28]">{error}</p><Button variant="outline" className="mt-4" onClick={() => void loadRecords()}><RefreshCw/><BiText ko="다시 시도" zh="重新读取"/></Button></div></div>
          : loading ? <div className="grid min-h-52 place-items-center text-sm text-black/45"><span><RefreshCw className="mr-2 inline size-4 animate-spin"/><BiText ko="기록을 불러오는 중" zh="正在读取记录"/></span></div>
          : records.length === 0 ? <div className="grid min-h-52 place-items-center p-8 text-center"><div><Database className="mx-auto size-7 text-black/30"/><p className="mt-3 text-sm text-black/45"><BiText ko={query ? "검색 결과가 없습니다" : "아직 완료된 진단이 없습니다"} zh={query ? "没有匹配的记录" : "暂时还没有已完成的测试记录"}/></p></div></div>
          : <div className="divide-y divide-black/8">{records.map((record) => <article key={record.id} className="grid gap-4 px-5 py-5 sm:grid-cols-[1.05fr_.9fr_1.5fr_.8fr] sm:items-center sm:px-6">
              <div><p className="text-xs text-black/38"><BiText ko="고객 휴대전화" zh="客户手机号"/></p><b className="mt-1 block font-mono text-sm">{record.phone}</b><p className="mt-1 text-xs text-black/38">{Number(record.photoCount)} <BiText ko="장 사진" zh="张照片"/></p></div>
              <div><p className="text-xs text-black/38"><BiText ko="진단 유형" zh="测试类型"/></p><p className="mt-1 text-sm font-medium">{kindLabel(record.kind)}</p></div>
              <div><p className="text-xs text-black/38"><BiText ko="저장된 결과" zh="测试结果"/></p><p className="mt-1 text-sm leading-6">{resultSummary(record)}</p>{record.bmi && <p className="mt-1 text-xs text-black/38">BMI {record.bmi}</p>}</div>
              <div className="sm:text-right"><p className="text-xs text-black/38"><BiText ko="완료 시간" zh="完成时间"/></p><p className="mt-1 text-xs leading-5">{formatTime(record.createdAt)}</p></div>
            </article>)}</div>}
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-black/10 bg-white p-6"><p className="flex items-start gap-2 font-medium"><Phone className="mt-1 size-5 shrink-0 text-[#174ea6]"/><BiText ko="관리자 휴대전화 번호" zh="管理员手机号"/></p><p className="mt-3 text-sm leading-6 text-black/48"><BiText ko="Vercel의 ADMIN_PHONES에 등록된 번호만 접근할 수 있습니다." zh="只有配置在 Vercel 的 ADMIN_PHONES 中的号码可以访问。"/></p></div><div className="rounded-2xl border border-black/10 bg-white p-6"><p className="flex items-start gap-2 font-medium"><ShieldCheck className="mt-1 size-5 shrink-0 text-[#174ea6]"/><BiText ko="데이터 접근 권한" zh="数据权限"/></p><p className="mt-3 text-sm leading-6 text-black/48"><BiText ko="고객은 본인의 기록만 확인합니다." zh="客户只能查看自己的记录。"/></p></div><label className="cursor-pointer rounded-2xl border border-[#174ea6]/25 bg-[#174ea6]/5 p-6"><p className="flex items-start gap-2 font-medium text-[#174ea6]"><Upload className="mt-1 size-5 shrink-0"/><BiText ko="상품 데이터 추가" zh="导入衣物商品数据"/></p><p className="mt-3 text-sm leading-6 text-black/48"><BiText ko="CSV 파일로 브랜드와 상품을 최대 500개씩 추가하거나 갱신합니다." zh="通过 CSV 每次新增或更新最多 500 件商品。"/></p><span className="mt-4 block text-sm font-medium">{importing ? "가져오는 중｜正在导入" : "CSV 선택｜选择 CSV"}</span><input type="file" accept=".csv,text/csv" className="sr-only" disabled={importing} onChange={(event) => void importProducts(event.target.files?.[0])}/>{importMessage && <span className="mt-3 block text-xs text-[#174ea6]">{importMessage}</span>}</label></div>
    </div>
  </main>;
}

function AdminStat({ icon, label, labelZh, value }: { icon: React.ReactNode; label: string; labelZh: string; value: number }) {
  return <div className="rounded-2xl border border-black/10 bg-white p-6"><span className="text-[#dd3a3a] [&_svg]:size-5">{icon}</span><b className="mt-6 block font-serif text-4xl">{value}</b><span className="mt-1 block text-sm text-black/45"><BiText ko={label} zh={labelZh}/></span></div>;
}
