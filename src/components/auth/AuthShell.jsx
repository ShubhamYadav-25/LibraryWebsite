import Header from "../Header";
import Footer from "../Footer";

const AuthShell = ({ children, eyebrow, title, subtitle, sideTitle, sideCopy }) => {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <Header />

      <main className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left Showcase Panel */}
          <section className="hidden lg:flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <div>
              <p className=" text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">
                LibraryMS Portal
              </p>
      
              <h1 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-slate-900">
                Discover, Borrow &
                <br />
                Learn
              </h1>
      
              <div className="mt-4 h-1 w-16 rounded-full bg-emerald-500" />
      
              <p className="mt-3 max-w-xl text-lg leading-8 text-slate-600">
                Access your library's collection, manage borrowing requests,
                track issued books, and stay updated with due dates through a
                centralized digital library platform designed for modern learning.
              </p>
            </div>
      
            {/* Library Image */}
            <div className="mt-5 ml-7 mr-7 overflow-hidden rounded-3xl border border-slate-200">
              <img
                src="https://res.cloudinary.com/dirsttw39/image/upload/f_auto,q_auto,ar_4:3,c_fill/v1780154878/libraryimage2_dxztfv.png"
                alt="Library"
                className="h-52 w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              />
            </div>
      
            {/* Feature Cards */}
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  📚
                </div>
      
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Search
                </p>
      
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Explore Resources
                </h3>
              </div>
      
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  🔖
                </div>
      
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Borrow
                </p>
      
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Manage Requests
                </h3>
      
              </div>
      
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  📈
                </div>
      
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Monitor
                </p>
      
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Stay Organized
                </h3>
              </div>
            </div>
          </section>
      
          {/* Right Auth Card */}
          <section className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10 flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">
                  {eyebrow}
                </p>
      
                <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                  {title}
                </h2>
      
                {subtitle && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {subtitle}
                  </p>
                )}
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
