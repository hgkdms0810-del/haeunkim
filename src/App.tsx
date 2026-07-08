import {
  ArrowUpRight,
  Banknote,
  Bell,
  ChevronRight,
  CreditCard,
  Eye,
  Home,
  LineChart,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  PiggyBank,
  ReceiptText,
  Settings,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from './lib/supabase';
import paypilotLogo from './assets/paypilot-logo.png';

function App() {
  const currentPath = window.location.pathname;
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('paypilot-dark-mode') === 'true');

  const spending = [
    { label: '식비', used: '₩310,000', budget: '₩360,000', remaining: '₩50,000', percent: 86, color: 'bg-rose-400', status: '주의' },
    { label: '교통', used: '₩75,000', budget: '₩100,000', remaining: '₩25,000', percent: 75, color: 'bg-sky-500', status: '안정' },
    { label: '카페', used: '₩68,000', budget: '₩90,000', remaining: '₩22,000', percent: 76, color: 'bg-fuchsia-500', status: '관리' },
    { label: '쇼핑', used: '₩120,000', budget: '₩150,000', remaining: '₩30,000', percent: 80, color: 'bg-amber-400', status: '관리' },
    { label: '구독', used: '₩37,000', budget: '₩50,000', remaining: '₩13,000', percent: 74, color: 'bg-violet-500', status: '안정' },
    { label: '생활', used: '₩110,000', budget: '₩100,000', remaining: '-₩10,000', percent: 100, color: 'bg-zinc-700', status: '초과' },
  ];

  const navLinkClass = (path: string) =>
    [
      'flex h-11 w-11 items-center justify-center rounded-lg transition',
      currentPath === path
        ? 'bg-zinc-950 text-white'
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950',
    ].join(' ');

  const pageTitle =
    currentPath === '/cards'
      ? '카드 관리'
      : currentPath === '/analytics'
        ? '소비 분석'
        : currentPath === '/settings'
          ? '설정'
          : '나의 금융 대시보드';

  const pageLabel =
    currentPath === '/cards'
      ? '등록한 카드와 결제 수단'
      : currentPath === '/analytics'
        ? '소비 패턴과 그래프'
        : currentPath === '/settings'
          ? '앱 환경 관리'
          : '오늘의 자산 리포트';

  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('paypilot-dark-mode', String(enabled));
  };

  return (
    <main className={`app-shell min-h-screen bg-neutral-100 text-zinc-950 ${darkMode ? 'app-dark' : ''}`}>
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="app-sidebar hidden w-20 shrink-0 flex-col items-center border-r border-zinc-200 bg-white py-6 lg:flex">
          <nav className="flex flex-1 flex-col gap-4">
            <a href="/" className={navLinkClass('/')} aria-label="홈">
              <Home className="h-5 w-5" />
            </a>
            <a href="/cards" className={navLinkClass('/cards')} aria-label="카드 관리">
              <CreditCard className="h-5 w-5" />
            </a>
            <a href="/analytics" className={navLinkClass('/analytics')} aria-label="소비 분석">
              <LineChart className="h-5 w-5" />
            </a>
            <a href="/settings" className={navLinkClass('/settings')} aria-label="설정">
              <Settings className="h-5 w-5" />
            </a>
          </nav>
        </aside>

        <section className="relative z-10 flex-1 px-5 py-5 sm:px-8 lg:px-10">
          <header className="app-header mb-8 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="paypilot-logo-wrap">
                <span className="paypilot-logo-glow" />
                <img
                  src={paypilotLogo}
                  alt="PayPilot logo"
                  className="paypilot-logo h-20 w-20 rounded-full object-cover shadow-lg ring-2 ring-white sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">{pageLabel}</p>
                <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{pageTitle}</h1>
              </div>
            </div>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm"
              aria-label="알림"
            >
              <Bell className="h-5 w-5" />
            </button>
          </header>

          {currentPath === '/cards' ? (
            <CardsPage />
          ) : currentPath === '/analytics' ? (
            <AnalyticsPage />
          ) : currentPath === '/settings' ? (
            <SettingsPage darkMode={darkMode} onDarkModeChange={handleDarkModeChange} />
          ) : (
            <DashboardPage spending={spending} />
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardPage({
  spending,
}: {
  spending: Array<{ label: string; used: string; budget: string; remaining: string; percent: number; color: string; status: string }>;
}) {
  const [savingGoals, setSavingGoals] = useState([
    { name: '여행 자금', current: 3800000, target: 5000000 },
  ]);
  const [newGoal, setNewGoal] = useState({ name: '', current: '', target: '' });

  const formatWon = (value: number) => `₩${value.toLocaleString('ko-KR')}`;
  const parseAmount = (value: string) => Number(value.replace(/[^\d]/g, ''));

  const handleAddSavingGoal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = parseAmount(newGoal.target);
    const current = parseAmount(newGoal.current);
    const name = newGoal.name.trim();

    if (!name || target <= 0) {
      return;
    }

    setSavingGoals((goals) => [...goals, { name, current: Math.min(current, target), target }]);
    setNewGoal({ name: '', current: '', target: '' });
  };

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm text-zinc-600">총 순자산</p>
              <p className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">₩3,560,820</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-sm font-medium text-amber-950">
              <ArrowUpRight className="h-4 w-4" />
              +2.4%
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <InfoBlock label="입출금" value="₩820,000" />
            <InfoBlock label="예적금" value="₩2,100,000" />
            <InfoBlock label="투자" value="₩640,820" valueClassName="text-amber-600" />
            <InfoBlock label="월급일" value="8일 전" />
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">이번 달 현금흐름</p>
              <h2 className="mt-1 text-xl font-semibold">₩230,000</h2>
            </div>
            <Wallet className="h-6 w-6 text-zinc-700" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <SummaryBox icon={<Banknote className="h-5 w-5 text-amber-600" />} label="수입" value="₩950,000" tone="amber" interactive />
            <SummaryBox icon={<ReceiptText className="h-5 w-5 text-rose-500" />} label="지출" value="₩720,000" tone="rose" interactive />
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">AI 소비 점수</p>
            <h2 className="mt-1 text-2xl font-semibold">지출 관리가 안정적이에요</h2>
          </div>
          <div className="mascot-score-card flex items-center gap-3 rounded-lg bg-zinc-950 px-4 py-3 text-white">
            <img src={paypilotLogo} alt="" className="mascot-mini h-12 w-12 rounded-full object-cover" />
            <div className="text-right">
              <p className="text-xs text-zinc-300">Score</p>
              <p className="text-2xl font-semibold">82</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">이번 달 지출</p>
            <p className="mt-2 text-xl font-semibold">₩720,000</p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">월 평균 지출</p>
            <p className="mt-2 text-xl font-semibold">₩780,000</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm text-amber-700">평균 대비 절감</p>
            <p className="mt-2 text-xl font-semibold text-amber-700">-₩60,000</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700">관리 수준</span>
            <span className="text-zinc-500">우수</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
            <div className="ai-score-fill h-full rounded-full bg-amber-400" style={{ '--score-width': '82%' } as React.CSSProperties} />
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            최근 월평균보다 6만원 적게 사용했어요. 생활비는 조금 넘었지만 전체 예산은 아직 안정권입니다.
          </p>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-500">예산 사용률</p>
              <h2 className="mt-1 text-xl font-semibold">이번 달 지출예산</h2>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100" aria-label="자세히">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 border-y border-zinc-100 py-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-zinc-500">총 예산</p>
              <p className="mt-1 text-lg font-semibold">₩850,000</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">사용</p>
              <p className="mt-1 text-lg font-semibold">₩720,000</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">잔여</p>
              <p className="mt-1 text-lg font-semibold text-amber-600">₩130,000</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-700">전체 예산 진행</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full w-[85%] rounded-full bg-zinc-950" />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {spending.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-2 text-xs text-zinc-500">{item.used} / {item.budget}</span>
                  </div>
                  <span className={`font-medium ${item.status === '초과' ? 'text-rose-600' : item.status === '주의' ? 'text-amber-600' : 'text-zinc-500'}`}>{item.status}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
                <p className="mt-2 text-xs text-zinc-500">남은 예산 {item.remaining}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
                <PiggyBank className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">저축 목표</p>
                <h2 className="text-xl font-semibold">목표 항목 관리</h2>
              </div>
            </div>
            <div className="mascot-orb hidden sm:block">
              <img src={paypilotLogo} alt="" className="h-14 w-14 rounded-full object-cover" />
            </div>
          </div>

          <form className="mt-6 grid gap-3" onSubmit={handleAddSavingGoal}>
            <input
              className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={newGoal.name}
              onChange={(event) => setNewGoal((goal) => ({ ...goal, name: event.target.value }))}
              placeholder="목표 이름"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                value={newGoal.current}
                onChange={(event) => setNewGoal((goal) => ({ ...goal, current: event.target.value }))}
                inputMode="numeric"
                placeholder="현재 금액"
              />
              <input
                className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                value={newGoal.target}
                onChange={(event) => setNewGoal((goal) => ({ ...goal, target: event.target.value }))}
                inputMode="numeric"
                placeholder="목표 금액"
              />
            </div>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-semibold text-amber-950 transition hover:bg-amber-400">
              <Plus className="h-4 w-4" />
              목표 추가
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {savingGoals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const remaining = Math.max(goal.target - goal.current, 0);

              return (
                <div key={goal.name} className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{goal.name}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {formatWon(goal.current)} / {formatWon(goal.target)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">{percent}%</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-zinc-500">남은 금액 {formatWon(remaining)}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

function CardsPage() {
  const cards = [
    {
      name: 'PayPilot Signature',
      type: 'Platinum Credit',
      number: '5532  48••  ••••  9210',
      holder: 'HAEUN KIM',
      used: '₩860,000',
      limit: '₩2,000,000',
      percent: 43,
      accent: 'from-zinc-950 via-zinc-800 to-amber-500',
      text: 'text-white',
    },
    {
      name: 'Lime Benefit',
      type: 'Everyday Credit',
      number: '4120  77••  ••••  3408',
      holder: 'HAEUN KIM',
      used: '₩420,000',
      limit: '₩900,000',
      percent: 47,
      accent: 'from-amber-200 via-yellow-100 to-yellow-300',
      text: 'text-zinc-950',
    },
  ];

  const transactions = [
    { place: '카페서울숲', category: '카페', amount: '-₩6,800', time: '오늘 12:42' },
    { place: '쿠팡 정기배송', category: '생활', amount: '-₩42,900', time: '어제 21:10' },
    { place: 'GS25 서울숲점', category: '편의점', amount: '-₩8,400', time: '어제 08:31' },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">내 카드</h2>
            <p className="mt-1 text-sm text-zinc-500">실물 카드처럼 보고, 한도와 결제 예정액을 관리해요.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
            <Plus className="h-4 w-4" />
            카드 추가
          </button>
        </div>

        <div className="mt-7 grid gap-5 xl:grid-cols-2">
          {cards.map((card) => (
            <article key={card.name} className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className={`credit-card-visual relative min-h-56 overflow-hidden rounded-lg bg-gradient-to-br ${card.accent} p-6 shadow-lg ${card.text}`}>
                <div className="credit-card-shine" />
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20" />
                <div className="absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute left-6 top-20 h-8 w-11 rounded-md border border-white/40 bg-gradient-to-br from-white/80 to-white/30 shadow-inner" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm opacity-75">{card.type}</p>
                    <h3 className="mt-1 text-xl font-semibold">{card.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-7 w-7 rounded-full bg-white/70 mix-blend-screen" />
                    <span className="-ml-3 h-7 w-7 rounded-full bg-amber-300/80 mix-blend-screen" />
                  </div>
                </div>
                <div className="relative mt-14">
                  <p className="font-mono text-lg tracking-widest">{card.number}</p>
                </div>
                <div className="relative mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-xs opacity-65">CARD HOLDER</p>
                    <p className="mt-1 text-sm font-semibold tracking-wide">{card.holder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-65">VALID THRU</p>
                    <p className="mt-1 font-mono text-sm font-semibold">07/30</p>
                  </div>
                </div>
                <p className="absolute bottom-5 right-6 text-lg font-bold italic">PayPilot</p>
                <MoreHorizontal className="absolute right-6 top-16 h-6 w-6 opacity-70" />
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">이번 달 사용액</p>
                    <p className="mt-1 text-2xl font-semibold">{card.used}</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-amber-600" />
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-zinc-500">월 한도</span>
                    <span className="font-medium">{card.limit}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full rounded-full bg-zinc-950" style={{ width: `${card.percent}%` }} />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium">한도</button>
                  <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium">분실</button>
                  <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium">내역</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold">이번 달 결제 예정</h2>
          <p className="mt-5 text-4xl font-semibold">₩1,280,000</p>
          <p className="mt-2 text-sm text-zinc-500">7월 25일 자동 출금 예정</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <SummaryBox icon={<Eye className="h-5 w-5 text-zinc-700" />} label="청구서" value="확인하기" tone="amber" />
            <SummaryBox icon={<LockKeyhole className="h-5 w-5 text-rose-500" />} label="보안" value="잠금 가능" tone="rose" />
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">최근 승인 내역</h2>
            <button className="text-sm font-medium text-zinc-500">전체보기</button>
          </div>
          <div className="mt-5 divide-y divide-zinc-100">
            {transactions.map((item) => (
              <div key={item.place} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                    <CreditCard className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.place}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.category} · {item.time}</p>
                  </div>
                </div>
                <p className="font-semibold">{item.amount}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const categories = [
    { name: '식비', amount: '₩310,000', percent: 86, color: 'from-rose-400 to-orange-300' },
    { name: '쇼핑', amount: '₩120,000', percent: 80, color: 'from-amber-300 to-yellow-200' },
    { name: '생활', amount: '₩110,000', percent: 100, color: 'from-zinc-500 to-zinc-800' },
    { name: '교통', amount: '₩75,000', percent: 75, color: 'from-blue-400 to-indigo-300' },
    { name: '카페', amount: '₩68,000', percent: 76, color: 'from-cyan-400 to-teal-300' },
    { name: '구독', amount: '₩37,000', percent: 74, color: 'from-violet-400 to-purple-300' },
  ];

  const weekly = [
    { day: '월', amount: '₩18,000' },
    { day: '화', amount: '₩26,000' },
    { day: '수', amount: '₩22,000' },
    { day: '목', amount: '₩34,000' },
    { day: '금', amount: '₩30,000' },
    { day: '토', amount: '₩46,000' },
    { day: '일', amount: '₩38,000' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">카테고리별 소비</h2>
              <p className="mt-1 text-sm text-zinc-500">이번 달 어디에 가장 많이 썼는지 한눈에 확인해요.</p>
            </div>
            <div className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white">총 ₩720,000</div>
          </div>

          <div className="mt-8 space-y-5">
            {categories.map((item, index) => (
              <div key={item.name} className="analytics-row">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${item.color}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.amount}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`analytics-bar h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ '--bar-width': `${item.percent}%`, '--bar-delay': `${index * 120}ms` } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 text-center shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold">소비 집중도</h2>
          <div className="analytics-donut mx-auto mt-8">
            <div className="analytics-donut-inner">
              <p className="text-3xl font-semibold">72%</p>
              <p className="mt-1 text-sm text-zinc-500">관리 양호</p>
            </div>
          </div>
          <p className="mx-auto mt-7 max-w-xs text-sm leading-6 text-zinc-500">
            식비와 쇼핑이 전체 소비의 60%를 차지해요.
          </p>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">요일별 지출 흐름</h2>
            <span className="text-sm text-zinc-500">최근 7일</span>
          </div>
          <div className="mt-6 divide-y divide-zinc-100">
            {weekly.map((item) => (
              <div key={item.day} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-700">
                    {item.day}
                  </span>
                  <span className="text-sm text-zinc-500">지출</span>
                </div>
                <span className="font-semibold">{item.amount}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold">AI 소비 인사이트</h2>
          <div className="mt-6 space-y-4">
            {[
              ['식비가 예산의 86%에 도달했어요.', '시험 기간 외식이 늘어난 흐름이에요. 다음 주는 학식이나 도시락 비중을 늘리면 좋아요.'],
              ['생활비가 예산을 1만원 초과했어요.', '문구류나 생필품처럼 작은 결제가 누적된 구간이라 다음 달 예산을 조금 올려도 좋아요.'],
              ['주말 지출이 평일보다 높아요.', '토요일 지출이 가장 높아서 약속 전 하루 한도를 정해두면 관리가 쉬워요.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg bg-zinc-50 p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
function SettingsPage({
  darkMode,
  onDarkModeChange,
}: {
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
}) {
  const settings = ['알림 받기', '월 예산 자동 계산', '다크 모드', '데이터 백업'];
  const [testInput, setTestInput] = useState('테스트 중입니다.');
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTestInput = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputText = testInput.trim();

    if (!inputText) {
      setSaveStatus('저장할 내용을 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('');

    const { error } = await supabase.from('input_db').insert({
      input_text: inputText,
    });

    if (error) {
      setSaveStatus(`저장 실패: ${error.message}`);
    } else {
      setSaveStatus('Supabase에 저장됐어요. Table Editor에서 확인해 보세요.');
      setTestInput('');
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">앱 설정</h2>
        <div className="mt-6 divide-y divide-zinc-100">
          {settings.map((label) => (
            <label key={label} className="flex items-center justify-between py-4">
              <span className="font-medium">{label}</span>
              <input
                type="checkbox"
                className="h-5 w-5 accent-amber-400"
                checked={label === '다크 모드' ? darkMode : label !== '다크 모드'}
                onChange={(event) => {
                  if (label === '다크 모드') {
                    onDarkModeChange(event.target.checked);
                  }
                }}
                readOnly={label !== '다크 모드'}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">Supabase 연결 테스트</p>
          <h2 className="mt-1 text-xl font-semibold">데이터 저장 확인</h2>
        </div>

        <form className="mt-6 grid gap-3" onSubmit={handleSaveTestInput}>
          <input
            className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            value={testInput}
            onChange={(event) => setTestInput(event.target.value)}
            placeholder="Supabase에 저장할 테스트 문장"
          />
          <button
            className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : 'Supabase에 저장'}
          </button>
        </form>

        {saveStatus ? <p className="mt-4 text-sm leading-6 text-zinc-500">{saveStatus}</p> : null}
        <p className="mt-4 text-xs leading-5 text-zinc-500">
          Supabase Table Editor에서 input_db 테이블을 열면 방금 저장한 input_text 값을 확인할 수 있어요.
        </p>
      </section>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  valueClassName = '',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-sm text-zinc-600">{label}</p>
      <p className={`mt-2 text-2xl font-medium ${valueClassName}`}>{value}</p>
    </div>
  );
}

function SummaryBox({
  icon,
  label,
  value,
  tone,
  interactive = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'amber' | 'rose';
  interactive?: boolean;
}) {
  const interactiveClass = interactive
    ? 'cursor-pointer transition duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg'
    : '';

  return (
    <div className={`rounded-lg p-4 ${tone === 'amber' ? 'bg-amber-50' : 'bg-rose-50'} ${interactiveClass}`}>
      {icon}
      <p className="mt-4 text-sm text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

export default App;
