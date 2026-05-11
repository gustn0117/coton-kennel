"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import { Section } from "@/components/Section";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Notice, type SiteImage } from "@/lib/supabase";
import NoticeModal, { isNew } from "@/components/NoticeModal";
import MapEmbed, { mapLink } from "@/components/MapEmbed";
import { useLang } from "@/lib/LangProvider";
import { pick, type Lang } from "@/lib/i18n";

const STORE_ADDRESS = "서울 강동구 구천면로29길 23";
const STORE_ADDRESS_ZH = "首尔江东区九泉面路29街23号";

function getSteps(lang: Lang) {
  if (lang === "zh") {
    return [
      {
        num: "01",
        title: "查看幼犬",
        desc: "通过 Coton Kennel 官方网站,\n查看目前可分养幼犬的详细资料,\n仔细了解性别、毛色等信息。",
      },
      {
        num: "02",
        title: "提前咨询",
        desc: "如有心仪的宝贝,请通过 KakaoTalk、电话或微信\n申请咨询。我们将向您介绍可分养时间、\n流程等详细信息。",
      },
      {
        num: "03",
        title: "参观咨询",
        desc: "通过 1:1 预约亲临犬舍参观,\n确认父母犬与饲养环境。",
      },
      {
        num: "04",
        title: "分养",
        desc: "我们会同时提供健康证明、血统证书及照护指南,\n并承诺终身售后照护。",
      },
      {
        num: "05",
        title: "照护指南",
        desc: "分养之后,我们将持续提供\n照护指南、美容、健康咨询等终身服务。",
      },
    ];
  }
  return [
    {
      num: "01",
      title: "아이들 확인",
      desc: "꼬똥 켄넬 공식 홈페이지를 통해 현재 분양 가능한\n아이들의 상세 프로필을 확인하실 수 있습니다.\n각 아이의 성별, 모색 등을 꼼꼼히 살펴보세요.",
    },
    {
      num: "02",
      title: "사전 상담",
      desc: "마음에 드는 아이가 있다면 카카오톡, 전화, WeChat으로\n상담을 요청해주세요. 분양 가능 시기, 절차 등을\n안내해드립니다.",
    },
    {
      num: "03",
      title: "방문 상담",
      desc: "1:1 방문 예약을 통해 직접 켄넬을 방문하시고,\n부모견과 환경을 확인하실 수 있습니다.",
    },
    {
      num: "04",
      title: "분양",
      desc: "건강 확인서, 혈통서, 케어 가이드를 함께 안내드리며,\n평생 사후 케어를 약속드립니다.",
    },
    {
      num: "05",
      title: "케어 가이드",
      desc: "분양 후에도 케어 가이드, 미용, 건강 상담을\n평생 제공해드립니다.",
    },
  ];
}

function getStoreInfo(lang: Lang) {
  if (lang === "zh") {
    return [
      { label: "营业时间", value: "每天 11:00 — 19:00" },
      { label: "预约方式", value: "KakaoTalk · 电话 · 微信" },
      { label: "位置", value: STORE_ADDRESS_ZH },
      { label: "停车", value: "可" },
    ];
  }
  return [
    { label: "운영 시간", value: "매일 11:00 — 19:00" },
    { label: "예약 방법", value: "카카오톡 · 전화 · WeChat" },
    { label: "위치", value: STORE_ADDRESS },
    { label: "주차", value: "가능" },
  ];
}

function getFaq(lang: Lang) {
  if (lang === "zh") {
    return [
      {
        q: "分养价格如何确定?",
        a: "价格依据血统、颜色、毛质、气质等因素分级,具体价格请通过 1:1 咨询了解。",
      },
      {
        q: "分养后的售后服务如何?",
        a: "分养之后,我们将持续提供照护指南、美容、健康咨询等终身服务。",
      },
      {
        q: "可以海外分养吗?",
        a: "请通过微信或邮件联系我们,我们会为您介绍具体流程。",
      },
      {
        q: "如何预约参观?",
        a: "通过电话或 KakaoTalk 进行 1:1 预约后即可参观。",
      },
      {
        q: "是否需要预约金?",
        a: "预约金相关信息我们通过 1:1 咨询单独说明。",
      },
      {
        q: "分养流程是怎样的?",
        a: "提前咨询 → 参观 → 匹配 → 分养 → 终身照护指南。",
      },
    ];
  }
  return [
    {
      q: "분양가는 어떻게 책정되나요?",
      a: "혈통, 색상, 모질, 기질에 따라 차등 책정되며, 정확한 안내는 1:1 상담을 통해 도와드리고 있습니다.",
    },
    {
      q: "분양 후 사후 관리는 어떻게 되나요?",
      a: "분양 후에도 케어 가이드, 미용, 건강 상담을 평생 제공해드립니다.",
    },
    {
      q: "해외 분양도 가능한가요?",
      a: "WeChat 또는 이메일로 문의 주시면 절차를 안내해드립니다.",
    },
    {
      q: "방문 예약은 어떻게 하나요?",
      a: "전화 또는 카카오톡으로 1:1 사전 예약 후 방문 가능합니다.",
    },
    {
      q: "예약금이 있나요?",
      a: "예약금 안내는 1:1 상담을 통해 개별적으로 진행하고 있습니다.",
    },
    {
      q: "분양 절차는 어떻게 되나요?",
      a: "사전 상담 → 방문 → 매칭 → 분양 → 평생 케어 가이드 순으로 진행됩니다.",
    },
  ];
}

export default function ContactPage() {
  const lang = useLang();
  const STEPS = getSteps(lang);
  const STORE_INFO = getStoreInfo(lang);
  const FAQ = getFaq(lang);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [openNoticeId, setOpenNoticeId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showWeChatQR, setShowWeChatQR] = useState(false);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);

  useEffect(() => {
    supabasePublic
      .from("notices")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data }) => setNotices((data ?? []) as Notice[]));
    supabasePublic
      .from("site_images")
      .select("*")
      .eq("key", "contact.hero")
      .order("slot", { ascending: true })
      .then(({ data }) => setHeroImages((data ?? []) as SiteImage[]));
  }, []);

  return (
    <>
      <Hero
        eyebrow="Contact us"
        title={pick(lang, "상담 및 문의", "咨询 / 联系")}
        description={pick(
          lang,
          <>
            분양 / 예약 / 견적 관련 문의 환영합니다.
            <br />
            전화 상담 시 상세 안내 도와드립니다.
          </>,
          <>
            欢迎咨询分养 / 预约 / 报价 等相关事宜。
            <br />
            电话咨询时我们会提供更详细的说明。
          </>
        )}
        variant="p3"
        images={heroImages}
      />

      {/* Vistor Guide - 5 alternating steps */}
      <Section className="pt-20 lg:pt-28">
        <div>
          <p className="font-serif text-[19px] font-semibold italic tracking-[0.04em] text-kennel-gold md:text-[22px]">
            Vistor <span className="text-ink-900 not-italic">Guide</span>
          </p>
          <p className="mt-3 text-[14px] text-ink-500">
            {pick(
              lang,
              "분양 안내와 절차를 5단계로 정리했습니다.",
              "我们将分养指南与流程整理为 5 个步骤。"
            )}
          </p>
        </div>

        <ol className="mt-12 space-y-3">
          {STEPS.map((s, i) => (
            <li
              key={i}
              className={`grid items-center gap-8 rounded-card-lg px-8 py-10 md:grid-cols-2 md:gap-12 md:px-12 ${
                i % 2 === 0 ? "bg-white" : "bg-cream-50"
              }`}
            >
              <div className={i % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <p className="tnum font-serif text-[18px] font-semibold italic tracking-[0.06em] text-kennel-gold">
                  {s.num}
                </p>
                <h3 className="mt-2 text-[22px] font-bold leading-[1.3] tracking-[-0.018em] text-ink-900 md:text-[26px]">
                  {s.title}
                </h3>
                <p className="mt-4 whitespace-pre-line text-[14px] leading-[1.85] text-ink-700">
                  {s.desc}
                </p>
              </div>
              <div
                className={`relative ${
                  i % 2 === 0 ? "md:order-2" : "md:order-1"
                }`}
              >
                <div className="aspect-[5/3] w-full overflow-hidden rounded-card bg-cream-100 ring-1 ring-cream-300/50">
                  <PuppyImage variant={(`p${(i + 1) * 2}` as `p${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`)} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Store map / location */}
      <Section className="pt-24 lg:pt-32">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-card-lg bg-cream-100 ring-1 ring-cream-300/50 md:aspect-[16/6]">
          <MapEmbed
            query={STORE_ADDRESS}
            zoom={17}
            title={pick(lang, "꼬똥켄넬 위치", "Coton Kennel 位置")}
          />
          <a
            href={mapLink(STORE_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[12.5px] font-medium text-ink-900 shadow-soft ring-1 ring-cream-300/70 backdrop-blur transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#7A6347" strokeWidth="1.8" aria-hidden>
              <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {pick(lang, "큰 지도로 보기", "查看大地图")}
          </a>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 rounded-card bg-cream-50 px-8 py-7 ring-1 ring-cream-300/50 md:grid-cols-4">
          {STORE_INFO.map((info, i) => (
            <div key={i}>
              <dt className="text-[12.5px] font-medium uppercase tracking-[0.18em] text-kennel-gold">
                {info.label}
              </dt>
              <dd className="mt-2 text-[14px] font-medium text-ink-900">
                {info.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 바로 연결하기 - 3 cards */}
      <Section className="pt-24 lg:pt-32">
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
          {pick(lang, "바로 연결하기", "立即联系")}
        </h2>
        <p className="mt-3 text-[14px] text-ink-500">
          {pick(
            lang,
            "분양 문의, 방문 예약, 가격 상담 등 모든 문의를 받고 있습니다.",
            "我们接受分养咨询、参观预约、价格咨询等各类问询。"
          )}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <a
            href="https://pf.kakao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-card-lg bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE500]">
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="#1A1A1A" aria-hidden>
                <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
              {pick(lang, "카카오톡 상담", "KakaoTalk 咨询")}
            </h3>
            <p className="mt-1 text-[13px] text-ink-500">@cotonkennel</p>
            <span className="mt-5 block w-full rounded-full bg-[#FEE500] px-4 py-2 text-center text-[12.5px] font-semibold text-ink-900">
              {pick(lang, "상담 시작하기", "开始咨询")}
            </span>
          </a>

          <a
            href="tel:0247299666"
            className="group rounded-card-lg bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kennel-btn">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
              {pick(lang, "전화 상담", "电话咨询")}
            </h3>
            <p className="mt-1 text-[13px] text-ink-500 tnum">02-472-9966</p>
            <span className="mt-5 block w-full rounded-full bg-kennel-btn px-4 py-2 text-center text-[12.5px] font-semibold text-cream-50">
              {pick(lang, "지금 전화하기", "立即拨打")}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setShowWeChatQR(true)}
            className="group rounded-card-lg bg-cream-50 p-7 text-left ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07C160]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
                <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3z" />
              </svg>
            </div>
            <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
              {pick(lang, "위챗 (WeChat)", "微信 (WeChat)")}
            </h3>
            <p className="mt-1 text-[13px] text-ink-500">cotonkennel</p>
            <span className="mt-5 block w-full rounded-full bg-[#07C160] px-4 py-2 text-center text-[12.5px] font-semibold text-white">
              {pick(lang, "QR 코드 보기", "查看二维码")}
            </span>
          </button>
        </div>
      </Section>

      {/* SNS 채널 */}
      <Section className="pt-24 lg:pt-32">
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
          {pick(lang, "SNS 채널", "社交媒体")}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Instagram",
              handle: "@cotonkennel",
              bg: "from-[#FEDA77] via-[#F58529] to-[#DD2A7B]",
              btn: "bg-gradient-to-br from-[#F58529] to-[#DD2A7B]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.75 3.75 0 01-1.38-.9 3.75 3.75 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 7.04a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm5.84-7.78a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0z" />
                </svg>
              ),
              href: "https://instagram.com/",
            },
            {
              name: "YouTube",
              handle: "@cotonkennel",
              bg: "from-[#FF0000] to-[#CC0000]",
              btn: "bg-[#FF0000]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden>
                  <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.56A3.02 3.02 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 002.13 2.14c1.88.56 9.37.56 9.37.56s7.49 0 9.37-.56a3.02 3.02 0 002.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
                </svg>
              ),
              href: "https://youtube.com/",
            },
            {
              name: pick(lang, "샤오홍슈 小红书", "小红书"),
              handle: "Coton Kennel",
              bg: "from-[#FF2442] to-[#E0162B]",
              btn: "bg-[#FF2442]",
              icon: (
                <span className="text-[10px] font-bold leading-none text-white">小红书</span>
              ),
              href: "https://www.xiaohongshu.com/",
            },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-card-lg bg-cream-50 p-7 ring-1 ring-cream-300/50 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${s.bg}`}
              >
                {s.icon}
              </div>
              <h3 className="mt-5 text-[17px] font-bold tracking-[-0.018em] text-ink-900">
                {s.name}
              </h3>
              <p className="mt-1 text-[13px] text-ink-500">{s.handle}</p>
              <span
                className={`mt-5 block w-full rounded-full ${s.btn} px-4 py-2 text-center text-[12.5px] font-semibold text-white`}
              >
                {pick(lang, "채널 바로가기", "进入频道")}
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* 자주 묻는 질문 */}
      <Section className="pt-24 lg:pt-32">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
            {pick(lang, "자주 묻는 질문", "常见问题")}
          </h2>
          <span className="tnum text-[12.5px] text-ink-400">
            {pick(lang, `총 ${FAQ.length}개`, `共 ${FAQ.length} 个`)}
          </span>
        </div>
        <ul className="mt-8 overflow-hidden rounded-card-lg border border-cream-300/60 bg-white">
          {FAQ.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <li
                key={i}
                className={i > 0 ? "border-t border-cream-200" : ""}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center gap-4 px-5 py-5 text-left transition-colors sm:px-7 ${
                    isOpen ? "bg-cream-50" : "hover:bg-cream-50/60"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kennel-gold/12 font-serif text-[14px] font-semibold italic text-kennel-gold">
                    Q
                  </span>
                  <span className="flex-1 text-[14.5px] font-medium leading-[1.5] text-ink-900 sm:text-[15px]">
                    {f.q}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 bg-ink-900 text-white"
                        : "bg-cream-100 text-ink-500"
                    }`}
                    aria-hidden
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-start gap-4 bg-cream-50/60 px-5 pb-6 pt-1 sm:px-7">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kennel-gold font-serif text-[14px] font-semibold italic text-white">
                        A
                      </span>
                      <p className="flex-1 whitespace-pre-line text-[14px] leading-[1.85] text-ink-700">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 공지사항 */}
      <Section className="pt-24 lg:pt-32">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.022em] text-ink-900 md:text-[40px] md:leading-[1.16]">
            {pick(lang, "공지사항", "公告")}
          </h2>
          <span className="tnum text-[12.5px] text-ink-400">
            {pick(lang, `총 ${notices.length}건`, `共 ${notices.length} 条`)}
          </span>
        </div>

        {notices.length === 0 ? (
          <div className="mt-8 rounded-card-lg border border-cream-300/60 bg-cream-50 px-6 py-14 text-center">
            <p className="text-[14px] text-ink-500">
              {pick(lang, "등록된 공지사항이 없습니다.", "暂无公告。")}
            </p>
          </div>
        ) : (
          <ul className="mt-8 overflow-hidden rounded-card-lg border border-cream-300/60 bg-white">
            {notices.map((n, i) => {
              const isFirst = i === 0;
              const newBadge = isNew(n.date);
              return (
                <li
                  key={n.id}
                  className={!isFirst ? "border-t border-cream-200" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setOpenNoticeId(n.id)}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-cream-50 sm:px-7 sm:py-5"
                  >
                    <span className="tnum hidden w-10 text-center text-[12.5px] text-ink-400 sm:block">
                      {String(notices.length - i).padStart(2, "0")}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-kennel-gold/12 text-[12px] font-semibold text-kennel-gold">
                      N
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-medium text-ink-900 group-hover:text-kennel-dark">
                          {n.title}
                        </span>
                        {newBadge && (
                          <span className="shrink-0 rounded-full bg-red-500 px-1.5 py-[1px] text-[9.5px] font-semibold tracking-wide text-white">
                            NEW
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="tnum hidden shrink-0 text-[12.5px] text-ink-500 sm:inline">
                      {n.date}
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-kennel-gold"
                    >
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <div className="pb-20" />

      {/* Notice modal */}
      <NoticeModal
        notices={notices}
        currentId={openNoticeId}
        onClose={() => setOpenNoticeId(null)}
        onChange={setOpenNoticeId}
      />

      {/* WeChat QR modal */}
      {showWeChatQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            className="relative w-[320px] rounded-card-xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWeChatQR(false)}
              aria-label={pick(lang, "닫기", "关闭")}
              className="absolute right-4 top-4 text-ink-500 hover:text-ink-900"
            >
              ✕
            </button>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07C160]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white" aria-hidden>
                <path d="M8.69 3C4.55 3 1.2 5.7 1.2 9.04c0 1.93 1.13 3.66 2.88 4.78l-.72 2.16 2.52-1.26c.66.18 1.34.28 2.04.3-.1-.42-.16-.84-.16-1.28 0-3.34 3.36-6.04 7.5-6.04.18 0 .36 0 .54.02C15.06 4.6 12.18 3 8.69 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-[17px] font-bold text-ink-900">
              {pick(lang, "위챗으로 상담하기", "微信咨询")}
            </h3>
            <p className="mt-1 text-[12.5px] text-ink-500">
              {pick(lang, "아래 QR 코드를 스캔해주세요", "请扫描下方二维码")}
            </p>
            <div className="mt-5 flex justify-center">
              <div className="rounded-card border border-cream-300 bg-white p-3">
                <FauxQR size={176} />
              </div>
            </div>
            <p className="tnum mt-5 text-[11.5px] text-ink-500">
              WeChat ID · cotonkennel
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function FauxQR({ size = 176 }: { size?: number }) {
  const N = 25;
  const cell = size / N;
  const isFinder = (r: number, c: number) => {
    const inFinder = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
    const onRing = (br: number, bc: number) => {
      if (!inFinder(br, bc)) return false;
      const dr = r - br;
      const dc = c - bc;
      return (
        dr === 0 ||
        dr === 6 ||
        dc === 0 ||
        dc === 6 ||
        (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
      );
    };
    return onRing(0, 0) || onRing(0, N - 7) || onRing(N - 7, 0);
  };
  const inFinderArea = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let on = false;
      if (isFinder(r, c)) on = true;
      else if (!inFinderArea(r, c)) {
        const v = (r * 31 + c * 17 + r * c * 5) % 7;
        on = v < 3;
      }
      if (on)
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell}
            height={cell}
            fill="#1A1A1A"
          />
        );
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect width={size} height={size} fill="white" />
      {cells}
    </svg>
  );
}
