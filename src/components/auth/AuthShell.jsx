import Header from "../Header";
import Footer from "../Footer";

const AuthShell = ({ children, eyebrow, title, subtitle, sideTitle, sideCopy }) => {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <Header />

      <main className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.28),_transparent_32%),linear-gradient(145deg,#0f172a,#134e4a_55%,#022c22)] p-10 text-white shadow-2xl lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)]" />
            <div className="relative z-10 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
                LibraryMS Access
              </p>
              <h1 className="mt-5 text-5xl font-black leading-tight">
                {sideTitle}
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-emerald-50/85">
                {sideCopy}
              </p>
            </div>

            <div className="relative z-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/80">Session</p>
                <p className="mt-2 text-lg font-semibold">HTTP-only cookies</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/80">Security</p>
                <p className="mt-2 text-lg font-semibold">Verified accounts</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/80">Access</p>
                <p className="mt-2 text-lg font-semibold">Google or password</p>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">
                  {eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                  {title}
                </h2>
                {subtitle ? (
                  <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
                ) : null}
              </div>

              {children}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthShell;
