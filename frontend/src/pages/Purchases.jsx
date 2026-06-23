import { useAsyncData } from "../hooks/useAsyncData";
import { getPurchases } from "../services/api";
import { Link } from "react-router-dom";

export default function Purchases() {
  const { data: purchases = [], loading } = useAsyncData(getPurchases, []);

  if (loading) {
    return <div className="p-6">Loading purchases...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Purchase History</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your orders and reading history
        </p>
      </div>

      <div className="grid gap-6">
        {purchases.map((item) => (
          <div
            key={item.bookId}
            className="rounded-[32px] border bg-white p-6 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img
                  src={item.cover}
                  className="h-16 w-12 rounded object-cover"
                />

                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-slate-500">
                    Purchased on{" "}{item.purchasedAt ? (
  new Date(item.purchasedAt).toLocaleString()
) : (
  "Recently purchased"
)}
                  </p>

                  <Link
                    to={`/books/${item.bookId}/read`}
                    className="text-violet-600 text-sm"
                  >
                    Read again
                  </Link>
                </div>
              </div>

              <div className="font-semibold text-violet-600">
                â‚¹ {item.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
