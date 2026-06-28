import {
  Bookmark,
  BookOpen,
  LogOut,
  Mail,
  ReceiptText,
  UserRound,
} from "lucide-react";
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

  // ✅ FIXED: become writer flow
  const handleBecomeWriter = async () => {
  try {
    const authPayload = await becomeWriter();
    login(authPayload);
    toast.success("Writer access enabled");
  } catch (err) {
    console.error("Become writer failed", err);
    toast.error("Could not enable writer access");
  }
};

  return (
    <div className="space-y-8">

      {/* PROFILE HEADER */}
      <section className="rounded-[36px] border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/95 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-7 w-7" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">
                Profile
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                {user?.name || "BookVerse Reader"}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">

                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold">
                  <UserRound className="h-4 w-4" />
                  {(roles || ["reader"])
  .map((r) => {
    const clean = r.replace(/^ROLE_/i, "").toLowerCase();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  })
  .join(", ")}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email || "No email added"}
                </span>

              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-3xl border px-4 py-3 text-sm font-semibold hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>

            {!hasRole("writer") && !hasRole("admin") && (
              <button
                onClick={handleBecomeWriter}
                className="inline-flex items-center gap-2 rounded-3xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Become a Writer
              </button>
            )}

          </div>
        </div>
      </section>

      {/* PURCHASES */}
      <section>
        <h2 className="text-xl font-semibold">Purchase History</h2>

        {purchases.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">No purchases yet.</p>
        )}

        {purchases.map((item) => {
          const id = bookIdFor(item);

          return (
            <div key={id} className="mt-4 flex justify-between border p-4 rounded-xl">

              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500">by {item.author}</p>
                <p className="text-sm">
                  <ReceiptText className="inline h-4 w-4" /> Rs {item.price}
                </p>
              </div>

              {id && (
                <Link
                  to={`/books/${id}/read?chapter=0`}
                  className="text-violet-600 font-semibold"
                >
                  <BookOpen className="inline h-4 w-4" /> Read
                </Link>
              )}

            </div>
          );
        })}
      </section>

      {/* LIBRARY */}
      <section>
        <h2 className="text-xl font-semibold">Bookmarks</h2>

        {library.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">No bookmarks yet.</p>
        )}

        {library.map((item) => {
          const id = bookIdFor(item);

          return (
            <div key={id} className="mt-4 flex justify-between border p-4 rounded-xl">

              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500">by {item.author}</p>
                <span className="text-xs text-gray-400">
                  <Bookmark className="inline h-3 w-3" /> Saved
                </span>
              </div>

              {id && (
                <div className="flex gap-2">
                  <Link to={`/books/${id}`} className="text-gray-600">
                    Details
                  </Link>

                  <Link
                    to={`/books/${id}/read?chapter=0`}
                    className="text-violet-600 font-semibold"
                  >
                    <BookOpen className="inline h-4 w-4" /> Read
                  </Link>
                </div>
              )}

            </div>
          );
        })}
      </section>

    </div>
  );
}