import { ReactNode } from "react";

export function BiText({ ko, zh, inline = false, zhClassName = "" }: { ko: ReactNode; zh: ReactNode; inline?: boolean; zhClassName?: string }) {
  return <span className={inline ? "bi-text bi-text--inline" : "bi-text"}>
    <span className="bi-text__ko">{ko}</span>
    <span className={`bi-text__zh ${zhClassName}`}>{zh}</span>
  </span>;
}
