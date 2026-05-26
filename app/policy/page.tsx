"use client";

import { ReactNode, useState } from "react";
import { Section } from "@/components/Section";

type Tab = "terms" | "privacy";

export default function PolicyPage() {
  const [tab, setTab] = useState<Tab>("terms");

  return (
    <>
      <header className="bg-cream-100 pt-12 md:pt-16">
        <div className="mx-auto max-w-page px-6 pb-10 lg:px-10">
          <span className="inline-block rounded-full bg-kennel-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-kennel-gold">
            꼬똥켄넬 공식 문서
          </span>
          <h1 className="mt-4 text-3xl font-bold text-ink-900 md:text-[32px] md:leading-[1.2]">
            {tab === "terms" ? "이용약관" : "개인정보처리방침"}
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            시행일: 2025년 1월 1일 · 최종 개정: 2025년 6월
          </p>
        </div>
      </header>

      <Section className="pb-24">
        <div className="flex border-b-2 border-cream-300/60">
          <TabButton active={tab === "terms"} onClick={() => setTab("terms")}>
            이용약관
          </TabButton>
          <TabButton
            active={tab === "privacy"}
            onClick={() => setTab("privacy")}
          >
            개인정보처리방침
          </TabButton>
        </div>

        <div className="rounded-b-3xl bg-white px-6 py-10 ring-1 ring-cream-300/50 md:px-12 md:py-14">
          {tab === "terms" ? <TermsContent /> : <PrivacyContent />}
        </div>
      </Section>
    </>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-[2px] border-b-[2.5px] px-6 py-3 text-sm font-medium transition-colors md:px-8 md:text-[15px] ${
        active
          ? "border-ink-900 text-ink-900"
          : "border-transparent text-ink-500 hover:text-ink-700"
      }`}
    >
      {children}
    </button>
  );
}

function Article({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10 last:mb-0">
      <h2 className="mb-3 flex items-center gap-3 border-b border-cream-200 pb-2 text-[15px] font-semibold text-ink-900">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-semibold text-cream-50">
          {num}
        </span>
        {title}
      </h2>
      <div className="space-y-2 text-[14px] leading-[1.9] text-ink-700">
        {children}
      </div>
    </section>
  );
}

function OrderedList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="ml-5 mt-2 list-decimal space-y-1.5 marker:text-ink-400">
      {items.map((item, i) => (
        <li key={i} className="pl-1 text-[14px] leading-[1.85] text-ink-700">
          {item}
        </li>
      ))}
    </ol>
  );
}

function DashList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="relative pl-5 text-[14px] leading-[1.85] text-ink-700 before:absolute before:left-0 before:text-ink-400 before:content-['—']"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border border-kennel-accent/40 bg-kennel-accent/10 px-4 py-3">
      <p className="text-[13px] leading-[1.75] text-kennel-brown">{children}</p>
    </div>
  );
}

function TermsContent() {
  return (
    <>
      <Article num={1} title="목적">
        <p>
          본 약관은 꼬똥켄넬(이하 &quot;업체&quot;)이 운영하는 웹사이트(이하
          &quot;사이트&quot;)에서 제공하는 서비스의 이용과 관련하여 업체와 이용자
          간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </Article>

      <Article num={2} title="용어의 정의">
        <OrderedList
          items={[
            <>
              <strong className="font-medium text-ink-900">
                &quot;사이트&quot;
              </strong>
              란 업체가 반려견 분양 및 상담 서비스를 제공하기 위해 운영하는
              웹사이트를 의미합니다.
            </>,
            <>
              <strong className="font-medium text-ink-900">
                &quot;이용자&quot;
              </strong>
              란 사이트에 접속하여 본 약관에 따라 서비스를 이용하는 자를
              의미합니다.
            </>,
            <>
              <strong className="font-medium text-ink-900">
                &quot;서비스&quot;
              </strong>
              란 반려견 정보 제공, 상담 신청, 문의 접수, SNS 연결 등의 제반
              서비스를 의미합니다.
            </>,
            <>
              <strong className="font-medium text-ink-900">
                &quot;분양 계약&quot;
              </strong>
              이란 업체와 이용자가 반려견 분양을 위해 체결하는 별도의 서면 또는
              전자적 계약을 의미합니다.
            </>,
          ]}
        />
      </Article>

      <Article num={3} title="약관의 효력 및 변경">
        <OrderedList
          items={[
            "본 약관은 사이트에 게시함으로써 효력이 발생합니다.",
            "업체는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있습니다.",
            "약관이 변경되는 경우 업체는 변경 내용을 적용일로부터 최소 7일 전(이용자에게 불리한 변경의 경우 30일 전)에 사이트에 공지합니다.",
            "이용자가 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로 간주합니다.",
          ]}
        />
      </Article>

      <Article num={4} title="서비스의 제공 및 변경">
        <p>업체는 다음과 같은 서비스를 제공합니다.</p>
        <DashList
          items={[
            "반려견 및 견종 정보 제공",
            "분양 상담 및 예약 서비스",
            "문의 접수 및 고객 응대",
            "SNS 및 외부 플랫폼 연동 서비스",
            "기타 업체가 정하는 서비스",
          ]}
        />
        <Notice>
          업체는 운영상·기술상의 필요에 따라 서비스 내용을 변경할 수 있습니다.
          서비스 변경 시에는 변경 내용 및 적용일을 사전에 공지합니다.
        </Notice>
      </Article>

      <Article num={5} title="서비스 이용 및 이용자 의무">
        <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
        <DashList
          items={[
            "허위 정보 작성 또는 타인의 정보 도용",
            "사이트 운영을 방해하는 행위 (해킹, 크롤링, 자동화 도구 이용 등 포함)",
            "법령 또는 공서양속에 반하는 행위",
            "업체 또는 제3자의 명예를 훼손하거나 지적재산권을 침해하는 행위",
            "상업적 목적의 무단 스팸 전송 또는 광고 행위",
            "기타 업체가 정한 이용 정책에 위반하는 행위",
          ]}
        />
        <p className="pt-2">
          위 행위 발생 시 업체는 사전 통보 없이 서비스 이용을 제한하거나 법적
          조치를 취할 수 있습니다.
        </p>
      </Article>

      <Article num={6} title="지적재산권">
        <OrderedList
          items={[
            "사이트 내 모든 콘텐츠(사진, 영상, 로고, 문구 등)의 저작권은 업체 또는 정당한 권리자에게 있으며, 무단 복제·배포·수정·전시를 금합니다.",
            "이용자는 사이트 콘텐츠를 업체의 서면 동의 없이 상업적 목적으로 이용할 수 없습니다.",
            "이용자가 사이트에 게시한 콘텐츠에 대한 책임은 이용자 본인에게 있으며, 업체는 해당 콘텐츠가 타인의 권리를 침해하는 경우 삭제 또는 비공개 처리할 수 있습니다.",
          ]}
        />
      </Article>

      <Article num={7} title="분양 계약 및 청약철회">
        <OrderedList
          items={[
            "반려견 분양 상담은 사이트를 통해 진행되며, 실제 분양 계약은 별도의 서면 또는 전자적 계약에 의합니다.",
            "분양 계약 체결 후 청약 철회 및 환불 조건은 관련 법령(「전자상거래 등에서의 소비자보호에 관한 법률」) 및 분양 계약서에 따릅니다.",
            "반려견의 특성상 계약 체결 후 일정 조건 하에서 청약철회가 제한될 수 있으며, 이는 계약 체결 시 별도로 안내드립니다.",
            "분양 후 반려견의 건강 이상 또는 유전 질환에 관한 사항은 분양 계약서의 보증 조항에 따라 처리됩니다.",
          ]}
        />
      </Article>

      <Article num={8} title="면책조항">
        <OrderedList
          items={[
            "업체는 천재지변, 서버 장애, 통신사 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.",
            "업체는 이용자가 사이트에 게시된 정보를 활용하여 발생한 손해에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.",
            "업체는 이용자 간 또는 이용자와 제3자 간에 발생한 분쟁에 대해 개입 의무가 없으며, 이로 인한 손해를 배상할 책임이 없습니다.",
            "사이트에 링크된 외부 사이트의 내용 및 서비스에 대해서 업체는 책임을 지지 않습니다.",
          ]}
        />
      </Article>

      <Article num={9} title="준거법 및 관할법원">
        <OrderedList
          items={[
            "본 약관은 대한민국 법률에 따라 해석되며 적용됩니다.",
            "서비스 이용과 관련하여 업체와 이용자 간에 발생한 분쟁에 대해서는 업체 소재지 관할 법원을 전속 관할로 합니다.",
            "분쟁 해결에 앞서 업체는 이용자와 원만한 합의를 위해 노력합니다.",
          ]}
        />
      </Article>

      <hr className="my-8 border-cream-200" />
      <p className="text-[13px] text-ink-400">
        부칙: 본 약관은 2025년 1월 1일부터 시행합니다.
      </p>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <Article num={1} title="수집하는 개인정보 항목">
        <p>
          꼬똥켄넬(이하 &quot;업체&quot;)은 상담 및 서비스 제공을 위해 아래와
          같이 개인정보를 수집합니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "이름",
            "연락처 (휴대전화번호)",
            "카카오톡 ID / SNS 계정",
            "문의 내용",
            "접속 로그 · IP · 쿠키",
          ].map((t) => (
            <span
              key={t}
              className="inline-block rounded-full border border-cream-300 px-3 py-1 text-xs font-medium text-ink-700"
            >
              {t}
            </span>
          ))}
        </div>
        <Notice>
          필수 항목은 이름과 연락처이며, 나머지는 선택 항목입니다. 선택 항목을
          제공하지 않으셔도 서비스 이용에는 지장이 없습니다.
        </Notice>
      </Article>

      <Article num={2} title="개인정보 수집 및 이용 목적">
        <DashList
          items={[
            "분양 상담 및 문의 응대",
            "고객 관리 및 서비스 제공",
            "예약 및 상담 일정 진행",
            "공지사항 및 서비스 관련 안내 전달",
            "서비스 품질 개선 및 통계 분석",
            "법령상 의무 이행",
          ]}
        />
      </Article>

      <Article num={3} title="개인정보 보유 및 이용기간">
        <p>
          업체는 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이
          파기합니다.
        </p>
        <p className="pt-1">
          다만, 관련 법령에 따라 아래와 같이 일정 기간 보관합니다.
        </p>
        <DashList
          items={[
            <>
              계약 또는 청약철회에 관한 기록 —{" "}
              <strong className="font-medium text-ink-900">5년</strong>{" "}
              (전자상거래법)
            </>,
            <>
              소비자 불만 또는 분쟁 처리에 관한 기록 —{" "}
              <strong className="font-medium text-ink-900">3년</strong>{" "}
              (전자상거래법)
            </>,
            <>
              접속에 관한 기록 —{" "}
              <strong className="font-medium text-ink-900">3개월</strong>{" "}
              (통신비밀보호법)
            </>,
          ]}
        />
      </Article>

      <Article num={4} title="개인정보 제3자 제공">
        <p>
          업체는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만,
          아래의 경우는 예외로 합니다.
        </p>
        <DashList
          items={[
            "이용자가 사전에 명시적으로 동의한 경우",
            "법령에 의거하거나 수사기관의 적법한 요청이 있는 경우",
          ]}
        />
      </Article>

      <Article num={5} title="개인정보 처리 위탁">
        <p>
          업체는 원활한 서비스 제공을 위해 일부 업무를 외부 업체에 위탁할 수
          있으며, 위탁 시 관련 법령에 따라 안전하게 관리합니다. 위탁 업체 및
          위탁 업무 내용이 변경될 경우 본 방침을 통해 공지합니다.
        </p>
      </Article>

      <Article num={6} title="이용자의 권리 및 행사 방법">
        <p>이용자는 언제든지 자신의 개인정보에 대해 다음의 권리를 행사할 수 있습니다.</p>
        <DashList
          items={[
            "개인정보 열람 요청",
            "오류 정정 또는 삭제 요청",
            "처리 정지 요청",
          ]}
        />
        <p className="pt-2">
          권리 행사는 아래 연락처(제9조)를 통해 요청하실 수 있으며, 업체는 지체
          없이 조치합니다. 만 14세 미만 아동의 개인정보를 수집하는 경우
          법정대리인의 동의를 받습니다.
        </p>
      </Article>

      <Article num={7} title="개인정보 보호를 위한 기술적·관리적 조치">
        <DashList
          items={[
            "개인정보 접근 권한 최소화 및 접근 통제",
            "보안 프로그램 설치 및 주기적 갱신",
            "개인정보 취급자 최소화 및 정기 교육 실시",
            "개인정보 처리 시스템 보안 점검",
            "외부 침입 차단을 위한 방화벽 운영",
          ]}
        />
      </Article>

      <Article num={8} title="쿠키(Cookie) 정책">
        <OrderedList
          items={[
            "사이트는 이용자 편의 향상을 위해 쿠키를 사용할 수 있습니다. 쿠키는 이용자의 브라우저에 저장되는 소량의 텍스트 파일입니다.",
            "쿠키는 이용자의 사이트 이용 패턴 분석, 서비스 개선 등의 목적으로 활용됩니다.",
            "이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 단, 쿠키를 비활성화하는 경우 일부 서비스 이용이 제한될 수 있습니다.",
          ]}
        />
      </Article>

      <Article num={9} title="개인정보 보호책임자 및 연락처">
        <p>
          개인정보 처리에 관한 문의, 불만 처리 및 피해 구제는 아래 담당자에게
          문의하시기 바랍니다.
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {[
            { label: "업체명", value: "꼬똥켄넬" },
            { label: "연락처", value: "010-9410-4366 / 010-5523-1973" },
            { label: "이메일", value: "이메일 주소 입력" },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-lg bg-cream-100 px-4 py-3"
            >
              <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ink-400">
                {c.label}
              </div>
              <div className="text-sm font-medium text-ink-900">{c.value}</div>
            </div>
          ))}
        </div>
        <Notice>
          개인정보 침해에 관한 신고 및 상담은 한국인터넷진흥원(KISA) 개인정보
          침해신고센터(privacy.kisa.or.kr / 국번 없이 118)에 문의하실 수
          있습니다.
        </Notice>
      </Article>

      <Article num={10} title="방침의 변경">
        <p>
          본 개인정보처리방침은 관련 법령 및 내부 정책에 따라 변경될 수
          있습니다. 변경 시에는 사이트를 통해 사전 공지하며, 변경된 방침은
          공지한 날로부터 효력이 발생합니다.
        </p>
      </Article>

      <hr className="my-8 border-cream-200" />
      <p className="text-[13px] text-ink-400">
        공고일: 2025년 1월 1일 · 시행일: 2025년 1월 1일
      </p>
    </>
  );
}
