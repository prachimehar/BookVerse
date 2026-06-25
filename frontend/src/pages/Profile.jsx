import { Bookmark, BookOpen, LogOut, Mail, ReceiptText, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncData";
import { becomeWriter, getLibrary, getPurchases } from "../services/api";
import { toast } from "react-hot-toast";

function bookIdFor(item) {
  return item?.id || item?.bookId;
}

export default function Profile() {
  const { user, roles, hasRole, login, logout } = useAuth();
  const navigate = useNavigate();

  const { data: purchases = [] } = useAsyncData(getPurchases, [], [user?.id]);
  const { data: library = [] } = useAsyncData(getLibrary, [], [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBecomeWriter = async () => {
    try {
      const authPayload = await becomeWriter();
      login(authPayload);
      toast.success("Writer access enabled");
    } catch {
      toast.error("Could not enable writer access");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || "Profile"} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-7 w-7" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{user?.name || "BookVerse Reader"}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <UserRound className="h-4 w-4" />
                  {(roles || ["reader"]).join(", ")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email || "No email added"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-rose-500/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-200"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          {!hasRole("writer") && !hasRole("admin") && (
            <button
              onClick={handleBecomeWriter}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Become a Writer
            </button>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Orders</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Purchase History</h2>
          </div>
          <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {purchases.length} books
          </span>
        </div>

        <div className="grid gap-4">
          {purchases.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No purchases yet.
            </div>
          )}

          {purchases.map((item) => {
            const id = bookIdFor(item);

            return (
              <div
                key={id}
                className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-200/50 transition hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 dark:hover:border-violet-500/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  {item.cover && <img src={item.cover} alt={item.title} className="h-20 w-14 rounded-2xl object-cover shadow-md shadow-slate-200/70 dark:shadow-black/30" />}
                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">by {item.author}</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-300">
                      <ReceiptText className="h-4 w-4" />
                      Rs {item.price ?? item.amount ?? 0}
                    </p>
                  </div>
                </div>

                {id && (
                  <Link
                    to={`/books/${id}/read?chapter=0`}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
                  >
                    <BookOpen className="h-4 w-4" />
                    Read
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">Library</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Bookmarks</h2>
          </div>
          <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {library.length} saved
          </span>
        </div>

        <div className="grid gap-4">
          {library.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No bookmarks yet.
            </div>
          )}

          {library.map((item) => {
            const id = bookIdFor(item);

            return (
              <div
                key={id}
                className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-200/50 transition hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20 dark:hover:border-violet-500/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  {item.cover && <img src={item.cover} alt={item.title} className="h-20 w-14 rounded-2xl object-cover shadow-md shadow-slate-200/70 dark:shadow-black/30" />}
                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">by {item.author}</p>
                    <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <Bookmark className="h-3.5 w-3.5" />
                      {item.price === 0 ? "Free read" : "Saved"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {id && (
                    <>
                      <Link
                        to={`/books/${id}`}
                        className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500/60 dark:hover:bg-slate-800 dark:hover:text-violet-200"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/books/${id}/read?chapter=0`}
                        className="inline-flex items-center justify-center gap-2 rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
                      >
                        <BookOpen className="h-4 w-4" />
                        Read
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
