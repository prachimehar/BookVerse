import { useEffect, useState } from "react";
import BookCard from "../components/ui/BookCard";
import { getBooks, getCategories } from "../services/api";
import { useAsyncData } from "../hooks/useAsyncData";

const sortOptions = [
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Popular" },
  { key: "highestRated", label: "Highest Rated" },
];

export default function Books() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);

  const { data: categories = [] } = useAsyncData(getCategories, []);

  useEffect(() => {
    let active = true;

    getBooks({
      genre: selectedGenre,
      price: selectedPrice,
      sort: selectedSort,
      q: search,
    })
      .then((result) => {
        if (active) {
          setBooks(Array.isArray(result) ? result : []);
        }
      })
      .catch((err) => {
        console.error("Failed to load books:", err);
        if (active) {
          setBooks([]);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedGenre, selectedPrice, selectedSort, search]);

  console.log("Books:", books);
  console.log("Categories:", categories);

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-7 rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Filters
          </h2>

          {/* Genres */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Genres
            </h3>

            <div className="mt-4 space-y-3">
              <button
                onClick={() => setSelectedGenre("All")}
                className={`block w-full rounded-3xl px-4 py-3 text-left text-sm ${
                  selectedGenre === "All"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                All
              </button>

              {Array.isArray(categories) &&
                categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedGenre(category)}
                    className={`block w-full rounded-3xl px-4 py-3 text-left text-sm ${
                      selectedGenre === category
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Price
            </h3>

            <div className="mt-4 space-y-3">
              {["all", "free", "paid"].map((value) => (
                <button
                  key={value}
                  onClick={() => setSelectedPrice(value)}
                  className={`block w-full rounded-3xl px-4 py-3 text-left text-sm ${
                    selectedPrice === value
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Sort by
            </h3>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="mt-4 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-violet-600">
                Explore Books
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                Find your next favorite read
              </h1>
            </div>

            <div className="relative w-full sm:w-96">
              <input
                type="search"
                placeholder="Search by title or author"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.isArray(books) &&
            books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
        </div>
      </section>
    </div>
  );
}