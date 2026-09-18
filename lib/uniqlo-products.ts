export type ProductRecord = {
  id: string;
  brand: string;
  sku?: string;
  nameKo: string;
  nameZh: string;
  category: string;
  colorFamily: string;
  seasonTags: string;
  bodyTags: string;
  frameTags: string;
  productUrl: string;
  imageUrl?: string;
  source: string;
};

export const uniqloSeed: ProductRecord[] = [
  { id: "uq-airism-crew", brand: "UNIQLO", nameKo: "AIRism 코튼 크루넥 티셔츠", nameZh: "AIRism棉质圆领T恤", category: "top", colorFamily: "neutral,light,deep", seasonTags: "spring,summer,autumn,winter", bodyTags: "X,A,T,H,O", frameTags: "natural,straight,wave", productUrl: "https://h.uniqlo.cn/search?description=AIRism%E6%A3%89%E8%B4%A8%E5%9C%86%E9%A2%86T%E6%81%A4", source: "UNIQLO CN catalog seed" },
  { id: "uq-crew-tee", brand: "UNIQLO", nameKo: "U 크루넥 반팔 티셔츠", nameZh: "U系列圆领短袖T恤", category: "top", colorFamily: "clear,neutral,deep", seasonTags: "spring,summer,autumn,winter", bodyTags: "X,A,T,H,O", frameTags: "natural,straight", productUrl: "https://h.uniqlo.cn/search?description=U%E7%B3%BB%E5%88%97%E5%9C%86%E9%A2%86T%E6%81%A4", source: "UNIQLO CN catalog seed" },
  { id: "uq-linen-shirt", brand: "UNIQLO", nameKo: "프리미엄 리넨 셔츠", nameZh: "优质亚麻衬衫", category: "shirt", colorFamily: "light,soft,warm", seasonTags: "spring,summer,autumn", bodyTags: "A,T,H,O", frameTags: "natural,straight", productUrl: "https://h.uniqlo.cn/search?description=%E4%BC%98%E8%B4%A8%E4%BA%9A%E9%BA%BB%E8%A1%AC%E8%A1%AB", source: "UNIQLO CN catalog seed" },
  { id: "uq-merino-knit", brand: "UNIQLO", nameKo: "엑스트라 화인 메리노 니트", nameZh: "精纺美利奴羊毛针织衫", category: "knit", colorFamily: "soft,warm,cool,deep", seasonTags: "autumn,winter", bodyTags: "X,A,T,H,O", frameTags: "wave,straight", productUrl: "https://h.uniqlo.cn/search?description=%E7%BE%8E%E5%88%A9%E5%A5%B4%E9%92%88%E7%BB%87%E8%A1%AB", source: "UNIQLO CN catalog seed" },
  { id: "uq-straight-jeans", brand: "UNIQLO", nameKo: "스트레이트 진", nameZh: "直筒牛仔裤", category: "pants", colorFamily: "cool,neutral,deep", seasonTags: "spring,summer,autumn,winter", bodyTags: "X,A,T,H,O", frameTags: "natural,straight", productUrl: "https://h.uniqlo.cn/search?description=%E7%9B%B4%E7%AD%92%E7%89%9B%E4%BB%94%E8%A3%A4", source: "UNIQLO CN catalog seed" },
  { id: "uq-wide-pants", brand: "UNIQLO", nameKo: "턱 와이드 팬츠", nameZh: "褶裥阔腿裤", category: "pants", colorFamily: "neutral,soft,deep", seasonTags: "spring,summer,autumn,winter", bodyTags: "X,T,H,O", frameTags: "natural,wave", productUrl: "https://h.uniqlo.cn/search?description=%E9%98%94%E8%85%BF%E8%A3%A4", source: "UNIQLO CN catalog seed" },
  { id: "uq-smart-pants", brand: "UNIQLO", nameKo: "감동 팬츠", nameZh: "感动裤", category: "pants", colorFamily: "neutral,cool,deep", seasonTags: "spring,summer,autumn", bodyTags: "X,A,H,O", frameTags: "straight", productUrl: "https://h.uniqlo.cn/search?description=%E6%84%9F%E5%8A%A8%E8%A3%A4", source: "UNIQLO CN catalog seed" },
  { id: "uq-flare-skirt", brand: "UNIQLO", nameKo: "볼륨 플레어 스커트", nameZh: "蓬松喇叭裙", category: "skirt", colorFamily: "light,soft,warm", seasonTags: "spring,summer,autumn", bodyTags: "X,T,H", frameTags: "wave", productUrl: "https://h.uniqlo.cn/search?description=%E5%96%87%E5%8F%AD%E8%A3%99", source: "UNIQLO CN catalog seed" },
];
