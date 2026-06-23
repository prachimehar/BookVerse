import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useAsyncData } from "../hooks/useAsyncData";
import { getPurchases, getLibrary } from "../services/api";

export default function Profile() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const { data: purchases = [] } = useAsyncData(getPurchases, []);
  const { data: library = [] } = useAsyncData(getLibrary, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-8">

      {/* USER INFO */}
      <div className="rounded-[36px] border bg-white p-8">
        <h1 className="text-3xl font-semibold">Profile</h1>

        <div className="mt-6">
          <p className="text-violet-600 uppercase text-xs">Account</p>
          <h2 className="text-xl font-semibold">
            {role?.toUpperCase()}
          </h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-slate-100 px-4 py-2 rounded-xl"
        >
          Sign out
        </button>
      </div>

      {/* PURCHASE HISTORY */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Purchase History</h2>

        <div className="grid gap-4">
          {purchases.length === 0 && (
            <p className="text-slate-500">No purchases yet</p>
          )}

          {purchases.map((item) => (
            <div
              key={item.bookId}
              className="border rounded-2xl p-4 bg-white flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-slate-500">{item.author}</p>

                <p className="text-xs text-slate-400 mt-1">
                  Purchased on{" "}
                  {item.purchasedAt
                    ? new Date(item.purchasedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">â‚¹{item.amount}</p>

                <Link
                  to={`/books/${item.bookId}/read`}
                  className="text-violet-600 text-sm"
                >
                  Read
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIBRARY / BOOKMARKS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Bookmarks</h2>

        <div className="grid gap-4">
          {library.length === 0 && (
            <p className="text-slate-500">No bookmarks yet</p>
          )}

          {library.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-4 bg-white flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-slate-500">{item.author}</p>
              </div>

              <Link
                to={`/books/${item.id}`}
                className="text-violet-600 text-sm"
              >
                Open
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
