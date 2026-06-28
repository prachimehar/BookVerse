import { useAsyncData } from "../hooks/useAsyncData";
import { useAuth } from "../hooks/useAuth";
import { getPurchases } from "../services/api";
import { Link } from "react-router-dom";

export default function Purchases() {
  const { user } = useAuth();
  const { data: purchases = [], loading } = useAsyncData(getPurchases, [], [user?.id]);

  if (loading) {
    return (
      <div className="p-6 text-slate-900 dark:text-slate-100">
        Loading purchases...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">
          Purchase History
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your orders and reading history
        </p>
      </div>

      <div className="grid gap-6">
        {purchases.map((item) => (
          <div
            key={item.bookId}
            className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img
                  src={item.cover}
                  className="h-16 w-12 rounded object-cover"
                />

                <div>
                  <h2 className="font-semibold text-slate-950 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Purchased on{" "}
                    {item.purchasedAt ? (
                      new Date(item.purchasedAt).toLocaleString()
                    ) : (
                      "Recently purchased"
                    )}
                  </p>

                  <Link
                    to={`/books/${item.bookId}/read`}
                    className="text-sm text-violet-600 dark:text-violet-400"
                  >
                    Read again
                  </Link>
                </div>
              </div>

              <div className="font-semibold text-violet-600 dark:text-violet-400">
                ₹ {item.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}