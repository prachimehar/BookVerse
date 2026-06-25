import { useNavigate, useParams } from "react-router-dom";
import { getBook, verifyPayment } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function Checkout() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: book, loading } = useAsyncData(() => getBook(id), null, [id, user?.id]);

  const handleConfirm = async () => {
    if (!book) return;

    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: book.price * 100,
      currency: "INR",
      name: "BookVerse",
      description: book.title,

      handler: async function () {
        try {
          await verifyPayment(book.id);

          toast.success("Purchase successful");

          navigate("/purchases");
        } catch (err) {
          console.error(err);
          toast.error("Payment verification failed");
        }
      },

      prefill: {
        name: user?.name || "BookVerse User",
        email: user?.email || "",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function () {
      toast.error("Payment failed");
    });

    razorpay.open();
  };

  if (loading) {
    return (
      <div className="rounded-[36px] border border-slate-200 bg-white p-10 text-center">
        Loading checkout...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="rounded-[36px] border border-slate-200 bg-white p-10 text-center">
        Book not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-semibold">Checkout</h1>

        <img
          src={book.cover}
          alt={book.title}
          className="mt-6 h-80 w-full rounded-3xl object-cover"
        />

        <h2 className="mt-6 text-2xl font-semibold">{book.title}</h2>

        <p className="text-slate-600">by {book.author}</p>

        <div className="mt-6 rounded-2xl bg-slate-100 p-4">
          <p className="text-lg font-semibold">Total Amount</p>
          <p className="mt-2 text-2xl font-bold text-violet-600">
            Rs {book.price}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-2xl border px-6 py-3 font-semibold"
          >
            Back
          </button>

          <button
            onClick={handleConfirm}
            className="rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white"
          >
            Confirm Purchase
          </button>
        </div>

      </div>
    </div>
  );
}
