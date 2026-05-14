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
import { ChevronLeft, ChevronRight, ChevronDown, CloseIcon } from "@/components/icons";

const STORE_ADDRESS = "서울 강동구 구천면로29길 23";
const STORE_ADDRESS_ZH = "首尔江东区九泉面路29街23号";
const NOTICE_PAGE_SIZE = 5;
const WECHAT_QR = "https://api.hsweb.pics/storage/v1/object/public/coton-kennel/guide/wechat-qr.png";
const PREMIUM_PET_IMG = "https://api.hsweb.pics/storage/v1/object/public/coton-kennel/guide/premiumpet.png";

function getSteps(lang: Lang) {
  if (lang === "zh") {
    return [
      { num: "01", title: "查看幼犬", desc: "通过 Coton Kennel 官方网站, 查看目前可分养幼犬的详细资料, 仔细了解性别、毛色等信息。" },
      { num: "02", title: "咨询", desc: "如有疑问,请通过电话咨询、KakaoTalk 频道或 WeChat 便捷地咨询我们。专业咨询师将亲切地为您介绍分养可否及相关信息(血统、健康状态、性格等多种信息)。" },
      { num: "03", title: "参观与咨询", desc: "您可以亲临犬舍,亲眼确认幼犬的状态与生活环境,并通过与专业人员的充分咨询,帮助您慎重做出决定。" },
      { num: "04", title: "分养", desc: "我们会与您一同确认国内外分养、繁育或宠物用途等符合您情况的细节后,为您提供最优的定制说明。" },
      { num: "05", title: "预约指南", desc: "棉花面纱犬分养速度较快,若有心仪的幼犬,建议提前预约。如希望参观咨询或分养,请先电话预约并接收预约金说明。确认预约金到账后,将按对应时间进行专业咨询。" },
    ];
  }
  return [
    { num: "01", title: "아이들 확인", desc: "꼬똥 켄넬 공식 홈페이지를 통해 현재 분양 가능한 아이들의 상세 프로필을 확인하실 수 있습니다. 각 아이의 성별, 모색 등을 꼼꼼히 살펴보세요." },
    { num: "02", title: "문의", desc: "궁금하신 사항은 전화 상담, 카카오톡 채널, 또는 WeChat을 통해 편리하게 문의해 주시기 바랍니다. 전문 상담사가 분양 가능 여부 및 관련 정보(혈통, 건강 상태, 성격 등 다양한 정보)를 친절하게 안내해 드립니다." },
    { num: "03", title: "방문 및 상담", desc: "직접 방문하셔서 아이의 컨디션과 생활 환경을 눈으로 확인하시고, 전문가와의 충분한 상담을 통해 신중하게 결정하실 수 있도록 도와드립니다." },
    { num: "04", title: "분양", desc: "국내외 분양 여부, 브리딩 또는 펫 목적 등 고객님의 상황에 맞는 세부 사항을 함께 확인한 후, 최적의 맞춤 안내를 제공해 드립니다." },
    { num: "05", title: "예약 안내", desc: "꼬똥 드 툴레아는 분양이 빠르게 이루어지는 특성이 있어, 원하시는 아이가 있으실 경우 사전 예약을 권장드립니다. 방문 상담 또는 분양을 원하시는 경우, 먼저 전화로 예약 후 예약금 안내를 받아보세요. 예약금 입금이 확인된 후 해당 시간에 맞춰 전문 상담이 진행됩니다." },
  ];
}

function getRefund(lang: Lang) {
  if (lang === "zh") {
    return [
      { label: "国内分养", body: "如参观后不希望分养,预约金将全额退还。我们会尽最大努力,让您可以毫无负担地慎重做出决定。" },
      { label: "海外分养", body: "海外发货开始前可全额退还预约金。但海外发货开始后会产生航空运费,可能无法全额退还,敬请谅解。" },
    ];
  }
  return [
    { label: "국내 분양", body: "방문 후 분양을 원하지 않으실 경우, 예약금은 전액 환불 됩니다. 고객님께서 부담 없이 신중하게 결정하실 수 있도록 최대한 배려하겠습니다." },
    { label: "해외 분양", body: "해외 발송이 시작되기 전까지는 예약금 전액 환불이 가능합니다. 단, 해외 발송이 시작된 이후에는 항공 운송료가 발생하여 전액 환불이 어려울 수 있는 점 양해 부탁드립니다." },
  ];
}

function getFaq(lang: Lang) {
  if (lang === "zh") {
    return [
      { q: "棉花面纱犬性格如何?", a: "棉花面纱犬整体来说性情温和、非常喜欢人,\n社交能力好,即使是陌生人也能很快靠近,\n叫声不多,非常适合室内饲养。" },
      { q: "成犬大约能长到几公斤?", a: "受父母犬遗传影响有所差异,\n平均约 5~7 公斤,个体之间可能略有差异。" },
      { q: "食欲怎么样?", a: "大多数都吃得很好,但偶尔也有食欲较小的孩子,\n这种情况下可以加入少量泡软的狗粮一同喂食,通常会吃得更好。" },
      { q: "为什么价格较高?", a: "棉花面纱犬在国内还属于稀有犬种,\n血统管理和繁育标准都较为严格,因此分养价格较高。" },
      { q: "与其他犬种相比有什么差别?", a: "棉花面纱犬具有以下特点:\n· 被毛柔软、质感独特\n· 性格亲人\n· 叫声较少\n· 整体体质健康\n即便是初次饲养也容易上手。" },
      { q: "疫苗接种是如何进行的?", a: "· 较小的幼犬:已完成第 1 次接种\n· 月龄稍大的:已完成第 2 次接种\n之后请按每 2 周一次的间隔进行追加接种。" },
      { q: "血统证书是什么?", a: "血统证书是证明该幼犬父母犬及血统的正式文件。\n但近年伪造案例较多,\n部分犬舍会有限制性地发放。" },
      { q: "如何预防分离焦虑?", a: "出生后 2~6 个月期间,\n请避免形成过度依恋,\n同时也让幼犬适应独处时间,\n培养独立性非常重要。\n此阶段管理得当有助于预防分离焦虑。" },
      { q: "散步需要多少?", a: "每周 1~3 次,\n每次约 20~30 分钟左右轻松散步即可。" },
      { q: "棉花面纱犬健康吗?", a: "是的,棉花面纱犬整体来说是较为健康的犬种。\n腿部较为结实,\n遗传性疾病发生较少,\n与其他小型犬(如膝盖骨问题较多的品种)相比,\n就医频率较低。" },
      { q: "犬舍里通常都是几个月的孩子?", a: "一般以 2~6 个月之间的幼犬最多。" },
      { q: "便溺训练容易吗?", a: "棉花面纱犬学习能力相对较好,\n只要持续而一致地训练,\n便溺训练完全可以做到。" },
    ];
  }
  return [
    { q: "꼬똥은 성격이 어떤가요?", a: "꼬똥은 전반적으로 온순하고 사람을 매우 좋아하는 견종입니다.\n사교성이 좋아 처음 보는 사람에게도 잘 다가가며,\n짖음이 많은 편이 아니라 실내에서 키우기에도 적합한 아이들입니다." },
    { q: "성견이 되면 몇 kg 정도까지 크나요?", a: "부모견의 유전적인 영향에 따라 차이가 있습니다.\n평균 약 5~7kg, 개체마다 차이가 있을 수 있습니다." },
    { q: "밥을 잘 먹나요?", a: "대부분 잘 먹는 편이지만, 간혹 입이 짧은 아이도 있습니다.\n이 경우 불린 사료를 소량 섞어 급여하면 훨씬 잘 먹는 편입니다." },
    { q: "가격대가 높은 이유는 무엇인가요?", a: "꼬똥은 국내에서 아직 희소성이 높은 견종이며,\n혈통 관리와 번식 기준이 까다로운 편이라 분양가가 높은 편입니다." },
    { q: "다른 견종과의 차별점은 무엇인가요?", a: "꼬똥은\n· 털이 부드럽고 독특한 질감\n· 사람을 잘 따르는 성격\n· 짖음이 적은 편\n· 전반적으로 건강한 체질\n이러한 특징으로 초보자도 키우기 좋은 견종입니다." },
    { q: "접종은 어떻게 진행되나요?", a: "· 어린 강아지: 1차 접종 완료 상태\n· 개월수가 조금 더 된 경우: 2차 접종까지 진행\n이후에는 2주 간격으로 추가 접종을 진행하시면 됩니다." },
    { q: "혈통증명서는 무엇인가요?", a: "혈통증명서는 해당 강아지의 부모견 및 혈통을 증명하는 공식 문서입니다.\n다만 최근 혈통서 위조 사례가 많아,\n일부 켄넬에서는 발급을 제한적으로 진행하는 경우도 있습니다." },
    { q: "분리불안은 어떻게 예방하나요?", a: "생후 2개월 ~ 6개월 사이에는\n너무 과도한 애착 형성을 피하고,\n혼자 있는 시간도 적응시키고\n자립심을 키워주는 것이 중요합니다.\n이 시기에 관리가 잘 되면 분리불안 예방에 도움이 됩니다." },
    { q: "산책은 얼마나 필요한가요?", a: "주 1~3회,\n1회 약 20~30분 정도\n가볍게 해주시면 충분합니다." },
    { q: "꼬똥은 건강한 편인가요?", a: "네, 꼬똥은 전반적으로 건강한 견종입니다.\n· 다리가 튼튼한 편이며\n· 유전병 발생이 비교적 적습니다\n다른 소형견(예: 슬개골 이슈가 많은 견종)에 비해\n병원 방문 빈도가 낮은 편입니다." },
    { q: "켄넬에는 보통 몇 개월 아이들이 있나요?", a: "일반적으로 2~6개월 사이의 아이들이 가장 많이 있습니다." },
    { q: "배변 교육은 잘 되나요?", a: "꼬똥은 비교적 학습 능력이 좋은 편이라\n일관성 있게 교육하면 배변 훈련도 충분히 가능합니다." },
  ];
}

const FAQ_PAGE_SIZE = 6;

export default function ContactPage() {
  const lang = useLang();
  const STEPS = getSteps(lang);
  const REFUND = getRefund(lang);
  const FAQ = getFaq(lang);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [openNoticeId, setOpenNoticeId] = useState<string | null>(null);
  const [faqPage, setFaqPage] = useState(0);
  const [openFaqKey, setOpenFaqKey] = useState<number | null>(0);
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
      <section className="mx-auto w-full max-w-page-wide px-6 pt-16 lg:px-12 xl:px-20 2xl:px-[180px] lg:pt-20 xl:pt-28 2xl:pt-[109px]">
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
      </section>

      <div className="mt-10 space-y-10 lg:mt-12 lg:space-y-12 xl:space-y-16">
        {STEPS.map((s, i) => {
          const imgRight = i % 2 === 1; // 2,4단계는 사진 오른쪽
          const imgUrl = stepImages[`contact.step.${i + 1}`];
          const bandBg = imgRight ? "bg-brand-beige" : "";
          return (
            <div key={i} className={`w-full ${bandBg}`}>
              <section
                className={`mx-auto w-full max-w-page-wide px-6 lg:px-12 xl:px-20 2xl:px-[180px] ${
                  imgRight ? "py-10 lg:py-14 xl:py-16" : ""
                }`}
              >
                <article className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
                  <div className={`w-full ${imgRight ? "lg:order-2" : ""}`}>
                    <div
                      className={`mx-auto aspect-[3/2] w-full max-w-[520px] ${
                        imgRight ? "lg:ml-0 lg:mr-auto" : "lg:ml-auto lg:mr-0"
                      }`}
                    >
                      {imgUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgUrl}
                          alt={s.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full overflow-hidden rounded-[24px]">
                          <PuppyImage variant={`p${(i + 1) * 2}` as never} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`lg:max-w-[440px] ${
                      imgRight ? "lg:order-1 lg:ml-auto lg:pr-2" : "lg:pl-2"
                    }`}
                  >
                    <p className="text-[26px] font-bold leading-none tracking-[-0.4px] text-brand-brown lg:text-[30px]">
                      {s.num}
                    </p>
                    <h3 className="mt-2 text-[22px] font-bold leading-[1.2] tracking-[-0.32px] text-black lg:mt-3 lg:text-[28px]">
                      {s.title}
                    </h3>
                    <p className="mt-4 break-keep text-[15px] leading-[1.7] text-ink-700 lg:mt-5 lg:text-[16px]">
                      {s.desc}
                    </p>
                  </div>
                </article>
              </section>
            </div>
          );
        })}
      </div>

      {/* 예약금 환불 안내 */}
      <section className="mx-auto w-full max-w-page-wide px-6 pb-16 pt-12 lg:px-12 xl:px-20 2xl:px-[180px] lg:pb-20 xl:pb-24">
        <div className="space-y-6 border-t border-line-card pt-10 lg:space-y-8 lg:pt-12">
          {REFUND.map((r) => (
            <div
              key={r.label}
              className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-8 lg:gap-12"
            >
              <p className="shrink-0 text-[16px] font-bold text-brand-brown sm:w-[110px] lg:text-[18px]">
                {r.label}
              </p>
              <p className="break-keep text-[15px] leading-[1.7] text-ink-700 lg:text-[16px]">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 지도 (Figma 1563×665) */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-16 lg:px-12 xl:px-20 2xl:px-[174px] lg:pt-20 xl:pt-28 2xl:pt-[88px]">
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

      {/* 방문 안내 4 카드 (Figma 365×212 #f9f9f9) */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-12 lg:px-12 xl:px-20 2xl:px-[182px] lg:pt-14 xl:pt-16 2xl:pt-[60px]">
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
            value={<span className="tnum">0507-1390-8073</span>}
          />
          <VisitCard
            label={pick(lang, "운영시간", "营业时间")}
            value={pick(lang, "주차가능 24시간 연중무휴", "可停车 24小时 全年无休")}
          />
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
            highlight="0507-1390-8073"
            desc={pick(
              lang,
              "전화 상담 가능 시간은 평일 10:00–19:00입니다. 월요일은 휴무입니다.",
              "电话咨询时间为工作日 10:00–19:00。周一休息。"
            )}
            ctaLabel={pick(lang, "전화상담 바로가기", "立即拨打")}
            ctaBg="bg-brand-brown"
            ctaText="text-white"
            href="tel:050713908073"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={WECHAT_QR} alt="WeChat QR" className="block h-full w-full object-contain" />
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
              <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
                <defs>
                  <radialGradient id="contact-ig-g" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#FDF497" />
                    <stop offset="5%" stopColor="#FDF497" />
                    <stop offset="45%" stopColor="#FD5949" />
                    <stop offset="60%" stopColor="#D6249F" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </radialGradient>
                </defs>
                <circle cx="24" cy="24" r="24" fill="url(#contact-ig-g)" />
                <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.6" />
                <circle cx="24" cy="24" r="5.4" fill="none" stroke="#fff" strokeWidth="2.6" />
                <circle cx="30.6" cy="17.4" r="1.7" fill="#fff" />
              </svg>
            }
            iconBg=""
            title={pick(lang, "인스타그램 DM", "Instagram DM")}
            highlight={pick(lang, "일상 사진 · 숏폼 영상", "日常照片 · 短视频")}
            ctaLabel={pick(lang, "인스타그램 바로가기", "前往 Instagram")}
            ctaBg="bg-social-insta"
            ctaText="text-line-surface"
            href="https://www.instagram.com/coton_kennel_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
            href="https://youtube.com/@cotonkennel?si=_UU6ZdcNn1rZrtzg"
          />
          <SnsCard
            icon={<span className="text-[11px] font-bold text-white">小红书</span>}
            iconBg="bg-social-xhs"
            title={pick(lang, "샤오홍슈 (小红书)", "小红书")}
            highlight={pick(lang, "중국어 커뮤니티", "中文社区")}
            ctaLabel={pick(lang, "샤오홍슈 바로가기", "前往小红书")}
            ctaBg="bg-social-xhs"
            ctaText="text-white"
            href="https://www.xiaohongshu.com/user/profile/61a28839000000001000e304?xsec_token=YBlEemk-s1wYQ1Av9EU9rEhml6vuWQXT8EfisTKFHRAMA=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODg1ODo2Rj42NzUyOTgwNjczOTdIOz9M&apptime=1778217466&share_id=5737c633f0d74e5b9a720b40fbbf4f88"
          />
        </div>
      </section>

      {/* Premium Pet 배너 (Figma 1563×477 #f9f6f0) */}
      <section className="mx-auto w-full max-w-page-wide px-6 pt-20 lg:px-12 xl:px-20 2xl:px-[179px] lg:pt-20 xl:pt-28 2xl:pt-[78px]">
        <div className="flex flex-col items-center rounded-[24px] bg-brand-beige px-8 py-12 text-center lg:rounded-[30px] lg:px-8 lg:py-[52px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PREMIUM_PET_IMG}
            alt="Premium Pet"
            className="h-auto w-[220px] sm:w-[260px] lg:w-[300px]"
          />
          <p className="mt-6 max-w-[716px] text-[15px] leading-[1.6] text-ink-700 lg:mt-[20px] lg:text-[18px]">
            {pick(
              lang,
              "꼬똥 드 툴레아외에도 일반 견종등 추가 견종이 궁금하신 경우, 아래 전용 페이지에서 추가적으로 다양한 아이들을 확인하실 수 있습니다",
              "除了棉花面纱犬之外,如果您对一般犬种等其他犬种感兴趣,可通过下方的专用页面查看更多可爱的宝贝。"
            )}
          </p>
          <a
            href="https://premiumpet.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
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

        {(() => {
          const totalFaqPages = Math.max(1, Math.ceil(FAQ.length / FAQ_PAGE_SIZE));
          const safeFaqPage = Math.min(faqPage, totalFaqPages - 1);
          const visibleFaq = FAQ.slice(
            safeFaqPage * FAQ_PAGE_SIZE,
            (safeFaqPage + 1) * FAQ_PAGE_SIZE
          );
          return (
            <>
              <ul className="mt-8 space-y-4 lg:mt-[57px] lg:space-y-[27px]">
                {visibleFaq.map((f, i) => {
                  const key = safeFaqPage * FAQ_PAGE_SIZE + i;
                  const isOpen = openFaqKey === key;
                  return (
                    <li
                      key={key}
                      className="overflow-hidden rounded-[20px] border border-brand-brown bg-white shadow-card lg:rounded-[29px]"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-6 py-6 text-left lg:gap-[42px] lg:px-[59px] lg:py-[34px]"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center text-[16px] font-bold lg:h-[56px] lg:w-[56px] lg:rounded-[28px] lg:text-[24px] ${
                            isOpen
                              ? "rounded-[20px] bg-brand-brown text-white"
                              : "rounded-[20px] bg-brand-tan text-brand-brown"
                          }`}
                        >
                          Q
                        </span>
                        <span className="font-pretendard flex-1 text-[16px] font-bold leading-[1.3] text-black lg:text-[24px] xl:text-[26px] 2xl:text-[28px]">
                          {f.q}
                        </span>
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 lg:h-[51px] lg:w-[51px] ${
                            isOpen
                              ? "rotate-180 bg-brand-brown text-white"
                              : "bg-brand-tan text-brand-brown"
                          }`}
                          aria-hidden
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-start gap-4 px-6 pb-7 lg:gap-[42px] lg:px-[59px] lg:pb-[40px]">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-brand-tan text-[16px] font-bold text-brand-brown lg:h-[56px] lg:w-[56px] lg:rounded-[28px] lg:text-[24px]">
                              A
                            </span>
                            <p className="flex-1 whitespace-pre-line text-[14px] leading-[1.65] text-ink-700 lg:text-[18px] lg:leading-[28.785px]">
                              {f.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {totalFaqPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-[15px] lg:mt-12">
                  <button
                    type="button"
                    onClick={() => setFaqPage((p) => Math.max(0, p - 1))}
                    disabled={safeFaqPage === 0}
                    aria-label="Prev"
                    className="text-ink-500 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  {Array.from({ length: totalFaqPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFaqPage(i);
                        setOpenFaqKey(null);
                      }}
                      className={`tnum text-[15px] ${
                        i === safeFaqPage
                          ? "font-medium text-black"
                          : "font-normal text-ink-500"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFaqPage((p) => Math.min(totalFaqPages - 1, p + 1))
                    }
                    disabled={safeFaqPage === totalFaqPages - 1}
                    aria-label="Next"
                    className="text-ink-500 disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </>
          );
        })()}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={WECHAT_QR} alt="WeChat QR" className="block h-full w-full object-contain" />
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
      <p className="mt-3 text-[16px] font-medium text-brand-brown lg:text-[20px]">
        {highlight}
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

