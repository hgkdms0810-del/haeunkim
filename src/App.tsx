import { ArrowDownLeft, ArrowUpRight, Bell, ChevronRight, CreditCard, Home, LineChart, PiggyBank, Settings, Wallet } from 'lucide-react';

function App() {
  const spending = [
    { label: '식비', amount: '₩420,000', percent: 88, color: 'bg-zinc-950' },
    { label: '교통', amount: '₩180,000', percent: 54, color: 'bg-emerald-500' },
    { label: '쇼핑', amount: '₩260,000', percent: 66, color: 'bg-amber-400' },
  ];

  return (
    <main className="min-h-screen bg-neutral-100 text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-20 shrink-0 flex-col items-center border-r border-zinc-200 bg-white py-6 lg:flex">
          <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-lg font-bold text-white">
            h
          </div>
          <nav className="flex flex-1 flex-col gap-4">
            <button className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-white" aria-label="홈">
              <Home className="h-5 w-5" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100" aria-label="카드">
              <CreditCard className="h-5 w-5" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100" aria-label="투자">
              <LineChart className="h-5 w-5" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100" aria-label="설정">
              <Settings className="h-5 w-5" />
            </button>
          </nav>
        </aside>

        <section className="flex-1 px-5 py-5 sm:px-8 lg:px-10">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">오늘의 자산 리포트</p>
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">나의 금융 대시보드</h1>
            </div>
            <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm" aria-label="알림">
              <Bell className="h-5 w-5" />
            </button>
          </header>

          <div className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-sm text-zinc-600">총 순자산</p>
                  <p className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">₩124,560,820</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-emerald-950">
                  <ArrowUpRight className="h-4 w-4" />
                  +2.4%
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-zinc-600">입출금</p>
                  <p className="mt-2 text-2xl font-medium">₩12,400,000</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600">예적금</p>
                  <p className="mt-2 text-2xl font-medium">₩45,210,000</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600">투자</p>
                  <p className="mt-2 text-2xl font-medium text-emerald-600">₩66,950,000</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600">월급일</p>
                  <p className="mt-2 text-2xl font-medium">8일 전</p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">이번 달 현금흐름</p>
                  <h2 className="mt-1 text-xl font-semibold">₩1,850,000</h2>
                </div>
                <Wallet className="h-6 w-6 text-zinc-700" />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-emerald-50 p-4">
                  <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                  <p className="mt-4 text-sm text-zinc-500">수입</p>
                  <p className="mt-1 font-semibold">₩4,200,000</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-4">
                  <ArrowUpRight className="h-5 w-5 text-rose-500" />
                  <p className="mt-4 text-sm text-zinc-500">지출</p>
                  <p className="mt-1 font-semibold">₩2,350,000</p>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-lg bg-gradient-to-b from-amber-300 to-yellow-100 px-5 py-9 text-center shadow-sm sm:px-8">
            <p className="text-sm font-medium text-yellow-950">AI 소비 점수</p>
            <div className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-white text-center shadow-sm">
              <div>
                <p className="text-3xl font-semibold text-yellow-950">85</p>
                <p className="mt-1 text-sm text-zinc-600">최적</p>
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-sm text-lg font-medium leading-8 text-yellow-950">
              이번 달 평균보다 24만원 적게 쓰고 있어요.
            </p>
          </section>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">이번 달 지출예산</h2>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100" aria-label="자세히">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-7 h-4 overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full w-[76%] bg-zinc-950" />
              </div>
              <div className="mt-6 space-y-5">
                {spending.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-zinc-500">{item.amount}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-white">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">저축 목표</p>
                  <h2 className="text-xl font-semibold">여행 자금</h2>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold">₩3,800,000</p>
                  <p className="text-sm text-zinc-500">76%</p>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full w-[76%] bg-emerald-500" />
                </div>
                <p className="mt-5 text-sm leading-6 text-zinc-500">
                  목표 금액 ₩5,000,000까지 ₩1,200,000 남았어요.
                </p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
