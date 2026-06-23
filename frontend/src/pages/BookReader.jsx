import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { getBook, hasPurchased } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";

function fallbackContent(book, chapter) {
  return [
    chapter.title,
    book.description,
    "Preview chapter available for reading.",
  ];
}

export default function BookReader() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterIndex = Number(searchParams.get("chapter") || 0);

  const { data: book, loading } = useAsyncData(() => getBook(id), [id]);

  const [purchased, setPurchased] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function loadPurchase() {
      if (!id) return;

      setChecking(true);

      try {
        const result = await hasPurchased(id);
        setPurchased(result);
      } catch (err) {
        console.error(err);
        setPurchased(false);
      } finally {
        setChecking(false);
      }
    }

    loadPurchase();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center text-slate-700 dark:text-slate-200">Opening reader...</div>;

  if (!book)
    return <div className="p-10 text-center text-slate-700 dark:text-slate-200">Book not found</div>;

  if (checking)
    return <div className="p-10 text-center text-slate-700 dark:text-slate-200">Checking access...</div>;

  const chapters =
    book?.chapters?.length > 0
      ? book.chapters
      : [
          {
            title: "Preview Chapter",
            content: "No chapter data available.",
            unlocked: true,
          },
        ];

  const chapter = chapters[chapterIndex] || chapters[0];

  const canRead = purchased || chapter.unlocked;

  const paragraphs = chapter.content?.trim()
    ? chapter.content.split("\n").filter(Boolean)
    : fallbackContent(book, chapter);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

      {/* SIDEBAR (CARD STAYS WHITE) */}
      <aside className="h-fit rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">

        <Link
          to={`/books/${book.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to details
        </Link>

        <div className="mt-6">

          <p className="text-xs font-semibold uppercase text-slate-700">
            Chapters
          </p>

          <div className="mt-4 space-y-2">

            {chapters.map((item, index) => (
              <button
                key={index}
                onClick={() => setSearchParams({ chapter: String(index) })}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 border
                  ${
                    index === chapterIndex
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
              >
                <span>{item.title}</span>

                {!purchased && !item.unlocked && (
                  <Lock className="h-4 w-4" />
                )}
              </button>
            ))}

          </div>
        </div>
      </aside>

      {/* MAIN CARD (ALSO ALWAYS WHITE) */}
      <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

        <p className="text-sm uppercase tracking-[0.24em] text-violet-600">
          {book.title}
        </p>

        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          {chapter.title}
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          by {book.author}
        </p>

        {canRead ? (
          <div className="mt-10 space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-8 text-slate-800">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border p-8 text-center">

            <h2 className="text-2xl font-bold text-slate-900">
              Purchase Required
            </h2>

            <p className="mt-4 text-slate-600">
              Purchase this book to unlock all chapters.
            </p>

            <Link
              to={`/checkout/${book.id}`}
              className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-white"
            >
              Buy Now
            </Link>

          </div>
        )}

      </article>
    </div>
  );
}
