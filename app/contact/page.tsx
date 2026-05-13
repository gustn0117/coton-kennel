"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import PuppyImage from "@/components/PuppyImage";
import { supabasePublic, type Notice, type SiteImage } from "@/lib/supabase";
import NoticeModal, { isNew } from "@/components/NoticeModal";
import MapEmbed, { mapLink } from "@/components/MapEmbed";
import { useLang } from "@/lib/LangProvider";
import { pick, type Lang } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/icons";

const STORE_ADDRESS = "서울 강동구 구천면로29길 23";
const STORE_ADDRESS_ZH = "首尔江东区九泉面路29街23号";
const NOTICE_PAGE_SIZE = 5;

function getSteps(lang: Lang) {
  if (lang === "zh") {
    return [
      { num: "01", title: "查看幼犬", desc: "通过 Coton Kennel 官方网站,\n查看目前可分养幼犬的详细资料,\n仔细了解性别、毛色等信息。" },
      { num: "02", title: "提前咨询", desc: "如有心仪的宝贝,请通过 KakaoTalk、电话或微信\n申请咨询。我们将向您介绍可分养时间、流程等详细信息。" },
      { num: "03", title: "参观咨询", desc: "通过 1:1 预约亲临犬舍参观,\n确认父母犬与饲养环境。" },
      { num: "04", title: "分养", desc: "我们会同时提供健康证明、血统证书及照护指南,\n并承诺终身售后照护。" },
      { num: "05", title: "预约指南", desc: "棉花面纱犬采用预约制分养。\n如希望预约,可通过 1:1 咨询另行说明预约金事宜。" },
    ];
  }
  return [
    { num: "01", title: "아이들 확인", desc: "꼬똥 켄넬 공식 홈페이지를 통해 현재 분양 가능한\n아이들의 상세 프로필을 확인하실 수 있습니다.\n각 아이의 성별, 모색 등을 꼼꼼히 살펴보세요." },
    { num: "02", title: "문의", desc: "궁금하신 사항은 카카오톡, 전화, WeChat으로\n상담을 요청해주세요. 분양 가능 시기, 절차 등을\n안내해드립니다." },
    { num: "03", title: "방문 및 상담", desc: "직접 방문하셔서 1:1 상담을 통해 켄넬을 둘러보시고,\n부모견과 환경을 확인하실 수 있습니다." },
    { num: "04", title: "분양", desc: "국내외 분양 여부에 따라 절차가 다르며,\n건강 확인서, 혈통서, 케어 가이드를 함께 안내드립니다." },
    { num: "05", title: "예약 안내", desc: "꼬똥 드 툴레아는 예약제로 분양됩니다.\n예약 희망 시, 예약금 안내는 1:1 상담으로 별도로 진행됩니다." },
  ];
}

function getFaq(lang: Lang) {
  if (lang === "zh") {
    return [
      { q: "棉花面纱犬性格如何?", a: "棉花面纱犬整体来说性情温和、非常喜欢人,社交能力好,即使是陌生人也能很快靠近。叫声不多,适合室内饲养。" },
      { q: "分养价格如何确定?", a: "价格依据血统、颜色、毛质、气质等因素分级,具体价格请通过 1:1 咨询了解。" },
      { q: "可以海外分养吗?", a: "请通过微信或邮件联系我们,我们会为您介绍具体流程。" },
      { q: "如何预约参观?", a: "通过电话或 KakaoTalk 进行 1:1 预约后即可参观。" },
    ];
  }
  return [
    { q: "꼬똥은 성격이 어떤가요?", a: "꼬똥은 전반적으로 온순하고 사람을 매우 좋아하는 견종입니다. 사교성이 좋아 처음 보는 사람에게도 잘 다가가며, 짖음이 많은 편이 아니라 실내에서 키우기에도 적합한 아이들입니다." },
    { q: "분양가는 어떻게 책정되나요?", a: "혈통, 색상, 모질, 기질에 따라 차등 책정되며, 정확한 안내는 1:1 상담을 통해 도와드리고 있습니다." },
    { q: "해외 분양도 가능한가요?", a: "WeChat 또는 이메일로 문의 주시면 절차를 안내해드립니다." },
    { q: "방문 예약은 어떻게 하나요?", a: "전화 또는 카카오톡으로 1:1 사전 예약 후 방문 가능합니다." },
  ];
}

export default function ContactPage() {
  const lang = useLang();
  const STEPS = getSteps(lang);
  const FAQ = getFaq(lang);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [openNoticeId, setOpenNoticeId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showWeChatQR, setShowWeChatQR] = useState(false);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [stepImages, setStepImages] = useState<Record<string, string | null>>({});
  const [noticePage, setNoticePage] = useState(0);

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
    supabasePublic
      .from("site_images")
      .select("*")
      .in("key", ["contact.step.1", "contact.step.2", "contact.step.3", "contact.step.4", "contact.step.5"])
      .then(({ data }) => {
        const map: Record<string, string | null> = {};
        ((data ?? []) as SiteImage[]).forEach((r) => {
          map[r.key] = r.image_url;
        });
        setStepImages(map);
      });
  }, []);

  const totalNoticePages = Math.max(1, Math.ceil(notices.length / NOTICE_PAGE_SIZE));
  const safeNoticePage = Math.min(noticePage, totalNoticePages - 1);
  const visibleNotices = notices.slice(safeNoticePage * NOTICE_PAGE_SIZE, (safeNoticePage + 1) * NOTICE_PAGE_SIZE);

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
        imageRadius={68}
      />

      {/* Vistor Guide intro + 5단계 프로세스 */}
      <section className="mx-auto w-full max-w-page-wide px-6 py-16 lg:px-12 xl:px-20 2xl:px-[180px] lg:pt-20 xl:pt-28 2xl:pt-[109px]">
        <h2 className="text-[32px] font-bold leading-[1.1] lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          <span>Vistor </span>
          <span className="text-brand-brown">Guide</span>
        </h2>
        <p className="mt-4 max-w-[1562px] text-[14px] leading-[1.65] text-black lg:mt-[57px] lg:text-[15px] lg:leading-[25px]">
          {pick(
            lang,
            "보다 세심하고 정확한 상담을 위해 모든 예약 및 예약금 안내는 전화 및 상담 채널을 통해 개별적으로 진행하고 있습니다. 홈페이지에는 별도의 예약금 금액이 표기되지 않으며, 고객님 상황에 맞춘 상세한 안내는 상담을 통해 도와드리고 있습니다.",
            "为了提供更细致和准确的咨询,所有预约及预约金的说明均通过电话与咨询渠道个别进行。网站上不显示预约金金额,我们将根据您的具体情况通过咨询为您提供详细说明。"
          )}
        </p>

        <div className="mt-10 space-y-10 lg:mt-12 lg:space-y-12 xl:space-y-16">
          {STEPS.map((s, i) => {
            const imgRight = i % 2 === 1; // 2,4단계는 사진 오른쪽
            const imgUrl = stepImages[`contact.step.${i + 1}`];
            return (
              <article
                key={i}
                className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14"
              >
                <div className={`w-full ${imgRight ? "lg:order-2" : ""}`}>
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt={s.title}
                      className={`mx-auto w-full max-w-[560px] ${
                        imgRight ? "lg:ml-0 lg:mr-auto" : "lg:ml-auto lg:mr-0"
                      }`}
                    />
                  ) : (
                    <div
                      className={`mx-auto aspect-[16/10] w-full max-w-[560px] overflow-hidden rounded-[24px] ${
                        imgRight ? "lg:ml-0 lg:mr-auto" : "lg:ml-auto lg:mr-0"
                      }`}
                    >
                      <PuppyImage variant={`p${(i + 1) * 2}` as never} />
                    </div>
                  )}
                </div>
                <div className={imgRight ? "lg:order-1" : ""}>
                  <p className="text-[26px] font-bold leading-none tracking-[-0.4px] text-brand-brown lg:text-[30px]">
                    {s.num}
                  </p>
                  <h3 className="mt-2 text-[22px] font-bold leading-[1.2] tracking-[-0.32px] text-black lg:mt-3 lg:text-[28px]">
                    {s.title}
                  </h3>
                  <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.65] text-ink-700 lg:mt-5 lg:text-[16px]">
                    {s.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 방문 안내 4 카드 (Figma 365×212 #f9f9f9) */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-16 lg:px-12 xl:px-20 2xl:px-[182px] lg:pt-20 xl:pt-28 2xl:pt-[88px]">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[37px]">
          <VisitCard
            label={pick(lang, "주소", "地址")}
            value={pick(
              lang,
              <>
                서울 강동구 구천면로29길 23 꼬똥켄넬
                <br />
                (지번) 서울 강동구 천호동 399-7 (우)05326
              </>,
              <>
                首尔江东区九泉面路29街23号 棉花面纱犬舍
                <br />
                (地番) 首尔江东区千户洞 399-7 (邮)05326
              </>
            )}
          />
          <VisitCard
            label={pick(lang, "교통정보", "交通")}
            value={pick(
              lang,
              <>
                지하철 - 천호역 5번출구 도보 10분 소요
                <br />
                자가용 - 천호동 골목냉면 입구에 위치
              </>,
              <>
                地铁 - 千户站 5 号出口步行 10 分钟
                <br />
                自驾 - 位于千户洞胡同冷面店入口
              </>
            )}
          />
          <VisitCard
            label={pick(lang, "대표번호", "电话")}
            value={<span className="tnum">02-472-9966</span>}
          />
          <VisitCard
            label={pick(lang, "운영시간", "营业时间")}
            value={pick(lang, "주차가능 24시간 연중무휴", "可停车 24小时 全年无休")}
          />
        </div>
      </section>

      {/* 지도 (Figma 1563×665) */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-12 lg:px-12 xl:px-20 2xl:px-[174px] lg:pt-20 xl:pt-28 2xl:pt-[88px]">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-[24px] bg-ink-300 ring-1 ring-line-card lg:aspect-[1563/665] lg:rounded-[32px]">
          <MapEmbed
            query={STORE_ADDRESS}
            zoom={17}
            title={pick(lang, "꼬똥켄넬 위치", "Coton Kennel 位置")}
          />
          <a
            href={mapLink(STORE_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[12.5px] font-medium text-black shadow-card backdrop-blur transition-colors hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#8E5E27" strokeWidth="1.8" aria-hidden>
              <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {pick(lang, "큰 지도로 보기", "查看大地图")}
          </a>
        </div>
      </section>

      {/* 바로 연결하기 - 카카오/전화/위챗 3 cards 481×615 */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-20 lg:px-12 xl:px-20 2xl:px-[180px] lg:pt-20 xl:pt-28 2xl:pt-[100px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          {pick(lang, "바로 연결하기", "立即联系")}
        </h2>
        <p className="mt-4 text-[15px] text-ink-500 lg:mt-[44px] lg:text-[18px]">
          {pick(
            lang,
            "분양 문의, 방문 예약, 가격 상담 등 모든 문의를 받고 있습니다.",
            "我们接受分养咨询、参观预约、价格咨询等各类问询。"
          )}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-14 2xl:mt-[44px] lg:grid-cols-3 lg:gap-10 xl:gap-14 2xl:gap-[36px]">
          {/* 카카오톡 */}
          <ContactCard
            icon={
              <svg viewBox="0 0 32 32" fill="#1A1A1A" aria-hidden className="h-7 w-7">
                <path d="M16 4C8.27 4 2 8.86 2 14.85c0 3.83 2.6 7.18 6.5 9.05l-1.4 4.94c-.13.45.36.82.76.58l5.84-3.62c.75.1 1.52.15 2.3.15 7.73 0 14-4.86 14-10.85S23.73 4 16 4z" />
              </svg>
            }
            title={pick(lang, "카카오톡 상담", "KakaoTalk 咨询")}
            highlight={pick(lang, "실시간 채팅 상담 · 빠른 답변", "实时聊天咨询 · 快速回复")}
            desc={pick(
              lang,
              "채팅창에 관심 있는 아이의 이름이나 조건을 남겨주시면 빠르게 답변드립니다.",
              "在聊天框中留下感兴趣的宝贝名字或条件,我们将快速回复。"
            )}
            ctaLabel={pick(lang, "카카오채널 바로가기", "前往 Kakao 频道")}
            ctaBg="bg-social-kakao"
            ctaText="text-black"
            href="https://pf.kakao.com/"
          />
          {/* 전화 */}
          <ContactCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" aria-hidden className="h-7 w-7">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
              </svg>
            }
            iconBg="bg-brand-brown"
            title={pick(lang, "전화 상담", "电话咨询")}
            highlight="010-0000-0000"
            desc={pick(
              lang,
              "전화 상담 가능 시간은 평일 10:00–19:00입니다. 월요일은 휴무입니다.",
              "电话咨询时间为工作日 10:00–19:00。周一休息。"
            )}
            ctaLabel={pick(lang, "전화상담 바로가기", "立即拨打")}
            ctaBg="bg-brand-brown"
            ctaText="text-white"
            href="tel:0247299666"
          />
          {/* 위챗 */}
          <button
            type="button"
            onClick={() => setShowWeChatQR(true)}
            className="card-asym group flex flex-col items-center border border-line-card bg-white p-10 text-center shadow-card transition-all hover:-translate-y-1"
          >
            <h3 className="mt-2 text-[22px] font-bold tracking-[-0.3px] text-black lg:text-[30px]">
              {pick(lang, "위챗 (WeChat)", "微信 (WeChat)")}
            </h3>
            <div className="mt-6 flex h-[260px] w-[260px] items-center justify-center rounded-[20px] border border-line-card bg-white lg:max-w-[312px] 2xl:h-[312px] 2xl:w-[312px]">
              <FauxQR size={240} />
            </div>
            <p className="mt-4 text-[12px] font-bold tracking-[-0.12px] text-black lg:text-[14px]">
              wechat id : cotonkennel
            </p>
          </button>
        </div>
      </section>

      {/* SNS 채널 - 인스타/유튜브/샤오홍슈 3 cards 481×432 */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-20 lg:px-12 xl:px-20 2xl:px-[180px] lg:pt-20 xl:pt-28 2xl:pt-[100px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          {pick(lang, "SNS 채널", "社交媒体")}
        </h2>
        <p className="mt-4 text-[15px] text-ink-500 lg:mt-[44px] lg:text-[18px]">
          {pick(
            lang,
            "다양한 SNS 채널에서 꼬똥켄넬의 소식과 아이들의 귀여운 일상을 만나보세요.",
            "请在多个社交媒体频道关注棉花面纱犬舍的动态与宝贝们的可爱日常。"
          )}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-14 2xl:mt-[44px] lg:grid-cols-3 lg:gap-10 xl:gap-14 2xl:gap-[36px]">
          <SnsCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" aria-hidden className="h-6 w-6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.9" fill="white" stroke="none" />
              </svg>
            }
            iconBg="bg-social-insta"
            title={pick(lang, "인스타그램 DM", "Instagram DM")}
            highlight={pick(lang, "일상 사진 · 숏폼 영상", "日常照片 · 短视频")}
            ctaLabel={pick(lang, "인스타그램 바로가기", "前往 Instagram")}
            ctaBg="bg-social-insta"
            ctaText="text-line-surface"
            href="https://www.instagram.com/"
          />
          <SnsCard
            icon={
              <svg viewBox="0 0 24 24" fill="white" aria-hidden className="h-6 w-6">
                <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.56A3.02 3.02 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 002.13 2.14c1.88.56 9.37.56 9.37.56s7.49 0 9.37-.56a3.02 3.02 0 002.13-2.14C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z" />
              </svg>
            }
            iconBg="bg-social-youtube"
            title={pick(lang, "유튜브 채널", "YouTube 频道")}
            highlight={pick(lang, "성장 영상 · 브이로그", "成长视频 · Vlog")}
            ctaLabel={pick(lang, "유튜브 채널 바로가기", "前往 YouTube")}
            ctaBg="bg-social-youtube"
            ctaText="text-white"
            href="https://www.youtube.com/"
          />
          <SnsCard
            icon={<span className="text-[11px] font-bold text-white">小红书</span>}
            iconBg="bg-social-xhs"
            title={pick(lang, "샤오홍슈 (小红书)", "小红书")}
            highlight={pick(lang, "중국어 커뮤니티", "中文社区")}
            ctaLabel={pick(lang, "샤오홍슈 바로가기", "前往小红书")}
            ctaBg="bg-social-xhs"
            ctaText="text-white"
            href="https://www.xiaohongshu.com/"
          />
        </div>
      </section>

      {/* Premium Pet 배너 (Figma 1563×477 #f9f6f0) */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-20 lg:px-12 xl:px-20 2xl:px-[179px] lg:pt-20 xl:pt-28 2xl:pt-[78px]">
        <div className="flex flex-col items-center rounded-[24px] bg-brand-beige px-8 py-12 text-center lg:rounded-[30px] lg:px-8 lg:py-[52px]">
          <div className="relative h-[130px] w-[280px] overflow-hidden lg:max-w-[420px] 2xl:h-[193px] 2xl:w-[420px]">
            <PuppyImage variant="p10" />
          </div>
          <p className="mt-6 max-w-[716px] text-[15px] leading-[1.6] text-ink-700 lg:mt-[20px] lg:text-[18px]">
            {pick(
              lang,
              "꼬똥 드 툴레아외에도 일반 견종등 추가 견종이 궁금하신 경우, 아래 전용 페이지에서 추가적으로 다양한 아이들을 확인하실 수 있습니다",
              "除了棉花面纱犬之外,如果您对一般犬种等其他犬种感兴趣,可通过下方的专用页面查看更多可爱的宝贝。"
            )}
          </p>
          <a
            href="#"
            className="mt-8 inline-flex h-[59px] w-[280px] items-center justify-between gap-3 bg-brand-brown px-8 text-[16px] text-white transition-transform hover:-translate-y-0.5 lg:mt-[34px] lg:w-[326px]"
            style={{ borderRadius: "29.5px" }}
          >
            <span className="flex-1 text-center">
              {pick(lang, "Premium Pet 방문하기", "前往 Premium Pet")}
            </span>
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden>
              <path
                d="M0 5h25m0 0L21 1m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* 자주 묻는 질문 FAQ */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-20 lg:px-12 xl:px-20 2xl:px-[179px] lg:pt-20 xl:pt-28 2xl:pt-[82px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          {pick(lang, "자주 묻는 질문", "常见问题")}
        </h2>
        <p className="mt-4 max-w-[1047px] text-[14px] text-ink-500 lg:mt-[51px] lg:text-[18px] lg:leading-[28.785px]">
          {pick(
            lang,
            "분양을 처음 고려하시는 분들이 가장 많이 물어보시는 질문들을 모았습니다. 여기서 해결되지 않는 궁금증은 언제든 상담 채널로 문의해 주세요.",
            "我们整理了首次考虑分养的客户最常问的问题。如有此处未解答的疑问,欢迎随时通过咨询渠道联系我们。"
          )}
        </p>

        <ul className="mt-8 space-y-4 lg:mt-[57px] lg:space-y-[27px]">
          {FAQ.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <li
                key={i}
                className="overflow-hidden rounded-[20px] border border-brand-brown bg-white shadow-card lg:rounded-[29px]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-6 py-6 text-left lg:gap-[42px] lg:px-[59px] lg:py-[34px]"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center text-[16px] font-bold lg:max-w-[56px] 2xl:h-[56px] 2xl:w-[56px] lg:rounded-[28px] lg:text-[24px] ${
                      isOpen
                        ? "rounded-[20px] bg-brand-brown text-white"
                        : "rounded-[20px] bg-brand-tan text-brand-brown"
                    }`}
                  >
                    Q
                  </span>
                  <span className="font-pretendard flex-1 text-[16px] font-bold leading-[1.3] text-black lg:text-[28px]">
                    {f.q}
                  </span>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 lg:max-w-[51px] 2xl:h-[51px] 2xl:w-[51px] ${
                      isOpen
                        ? "rotate-180 bg-brand-brown text-white"
                        : "bg-brand-tan text-brand-brown"
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
                    <div className="flex items-start gap-4 px-6 pb-7 pl-[60px] lg:gap-[42px] lg:px-[59px] lg:pb-[40px] lg:pl-[157px]">
                      <p className="flex-1 text-[14px] leading-[1.65] text-ink-500 lg:text-[18px] lg:leading-[28.785px]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 공지사항 테이블 (Figma 1555×58 헤더, NO/제목/날짜) */}
      <section className="mx-auto w-full max-w-page-wide px-6 pb-24 pt-20 lg:px-12 xl:px-20 2xl:px-[181px] lg:pb-20 xl:pb-28 2xl:pb-[100px] lg:pt-20 xl:pt-28 2xl:pt-[82px]">
        <h2 className="text-[32px] font-bold leading-[1.1] text-black lg:text-[44px] lg:leading-[64px] lg:tracking-[-0.55px]">
          {pick(lang, "공지사항", "公告")}
        </h2>

        {notices.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-line-card bg-brand-beige px-6 py-14 text-center">
            <p className="text-[14px] text-ink-500">
              {pick(lang, "등록된 공지사항이 없습니다.", "暂无公告。")}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 overflow-hidden rounded-[16px] border border-line-card lg:mt-14 2xl:mt-[61px]">
              {/* Header row */}
              <div className="hidden bg-brand-beige sm:grid sm:grid-cols-[80px_1fr_140px] lg:h-[58px]">
                <div className="font-pretendard flex items-center justify-center text-[14px] font-bold text-black lg:text-[18px] lg:leading-[28.785px]">
                  NO
                </div>
                <div className="font-pretendard flex items-center justify-center text-[14px] font-bold text-black lg:text-[18px] lg:leading-[28.785px]">
                  {pick(lang, "제목", "标题")}
                </div>
                <div className="font-pretendard flex items-center justify-center text-[14px] font-bold text-black lg:text-[18px] lg:leading-[28.785px]">
                  {pick(lang, "날짜", "日期")}
                </div>
              </div>
              {/* Rows */}
              <ul>
                {visibleNotices.map((n, i) => {
                  const num = notices.length - (safeNoticePage * NOTICE_PAGE_SIZE + i);
                  const newBadge = isNew(n.date);
                  return (
                    <li
                      key={n.id}
                      className="border-t border-line-card first:border-t-0"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenNoticeId(n.id)}
                        className="grid w-full grid-cols-[64px_1fr_100px] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-brand-beige sm:grid-cols-[80px_1fr_140px] lg:gap-0 lg:px-0 lg:py-[20px]"
                      >
                        <span className="tnum text-center text-[14px] text-ink-500 lg:text-[17.714px] lg:leading-[28.785px]">
                          {num}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="line-clamp-1 text-[14px] text-ink-500 lg:text-[17.714px] lg:leading-[28.785px]">
                            {n.title}
                          </span>
                          {newBadge && (
                            <span className="shrink-0 rounded-full bg-red-500 px-1.5 py-[1px] text-[9.5px] font-semibold text-white">
                              NEW
                            </span>
                          )}
                        </span>
                        <span className="tnum text-center text-[13px] text-ink-500 lg:text-[17.714px] lg:leading-[28.785px]">
                          {n.date}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Pagination */}
            {totalNoticePages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-[15px]">
                <button
                  type="button"
                  onClick={() => setNoticePage((p) => Math.max(0, p - 1))}
                  disabled={safeNoticePage === 0}
                  aria-label="Prev"
                  className="text-ink-500 disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalNoticePages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNoticePage(i)}
                    className={`tnum text-[15px] ${
                      i === safeNoticePage
                        ? "font-medium text-black"
                        : "font-normal text-ink-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setNoticePage((p) => Math.min(totalNoticePages - 1, p + 1))}
                  disabled={safeNoticePage === totalNoticePages - 1}
                  aria-label="Next"
                  className="text-ink-500 disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <NoticeModal
        notices={notices}
        currentId={openNoticeId}
        onClose={() => setOpenNoticeId(null)}
        onChange={setOpenNoticeId}
      />

      {showWeChatQR && (
        <div
          className="ck-modal-fade fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            className="ck-modal-pop relative w-[320px] rounded-[46px] bg-white p-8 text-center shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWeChatQR(false)}
              aria-label={pick(lang, "닫기", "关闭")}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-line-tag"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <h3 className="mt-4 text-[18px] font-bold text-black">
              {pick(lang, "위챗으로 상담하기", "微信咨询")}
            </h3>
            <div className="mt-5 flex justify-center">
              <div className="rounded-[20px] border border-line-card bg-white p-3">
                <FauxQR size={200} />
              </div>
            </div>
            <p className="tnum mt-5 text-[12px] text-ink-500">
              WeChat ID · cotonkennel
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function VisitCard({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-[20px] bg-line-surface px-5 py-6 lg:rounded-[24px] lg:px-8 lg:py-[40px]">
      <p className="text-center text-[16px] font-bold text-black lg:text-[21px]">
        {label}
      </p>
      <div className="my-4 h-px bg-line-card lg:my-[12px]" />
      <div className="text-center text-[13px] leading-[1.6] text-ink-800 lg:text-[16px]">
        {value}
      </div>
    </div>
  );
}

type ContactCardProps = {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  highlight: string;
  desc: string;
  ctaLabel: string;
  ctaBg: string;
  ctaText: string;
  href: string;
};

function ContactCard({
  icon,
  iconBg = "bg-social-kakao",
  title,
  highlight,
  desc,
  ctaLabel,
  ctaBg,
  ctaText,
  href,
}: ContactCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-asym group flex flex-col items-center border border-line-card bg-white p-10 text-center shadow-card transition-all hover:-translate-y-1"
    >
      <div className={`flex h-[58px] w-[58px] items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <h3 className="mt-6 text-[22px] font-bold tracking-[-0.3px] text-black lg:text-[30px]">
        {title}
      </h3>
      <p className="mt-3 text-[16px] font-medium text-brand-brown lg:text-[20px]">
        {highlight}
      </p>
      <p className="mt-6 max-w-[326px] text-[14px] leading-[1.65] text-ink-500 lg:mt-[37px] lg:text-[16px]">
        {desc}
      </p>
      <span
        className={`mt-8 inline-flex h-[59px] w-full max-w-[326px] items-center justify-between gap-2 px-8 text-[15px] lg:mt-14 2xl:mt-[63px] lg:text-[16px] ${ctaBg} ${ctaText}`}
        style={{ borderRadius: "29.5px" }}
      >
        <span className="flex-1 text-center">{ctaLabel}</span>
        <svg width="22" height="8" viewBox="0 0 22 8" fill="none" aria-hidden>
          <path
            d="M0 4h20m0 0L16 1m4 3l-4 3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </a>
  );
}

type SnsCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  highlight: string;
  ctaLabel: string;
  ctaBg: string;
  ctaText: string;
  href: string;
};

function SnsCard({
  icon,
  iconBg,
  title,
  highlight,
  ctaLabel,
  ctaBg,
  ctaText,
  href,
}: SnsCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-asym group flex flex-col items-center border border-line-card bg-white p-10 text-center shadow-card transition-all hover:-translate-y-1"
    >
      <div className={`flex h-[58px] w-[58px] items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <h3 className="mt-6 text-[22px] font-bold tracking-[-0.3px] text-black lg:text-[30px]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] text-ink-500 lg:text-[16px]">
        {highlight}
      </p>
      <span
        className={`mt-auto inline-flex h-[59px] w-full max-w-[326px] items-center justify-between gap-2 px-8 pt-0 text-[15px] lg:text-[16px] ${ctaBg} ${ctaText}`}
        style={{ borderRadius: "29.5px", marginTop: "auto" }}
      >
        <span className="flex-1 text-center">{ctaLabel}</span>
        <svg width="22" height="8" viewBox="0 0 22 8" fill="none" aria-hidden>
          <path
            d="M0 4h20m0 0L16 1m4 3l-4 3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </a>
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
      if (on) cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1A1A1A" />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect width={size} height={size} fill="white" />
      {cells}
    </svg>
  );
}
