import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  BookMarked,
  BookOpen,
  Compass,
  Home,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Feather,
  User,
  Users,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import ThemeToggle from "./ThemeToggle";

const baseNav = [
  { name: "Home", to: ROUTES.HOME, icon: Home },
  { name: "Explore", to: ROUTES.BOOKS, icon: Compass },
  { name: "Marketplace", to: ROUTES.MARKETPLACE, icon: ShoppingBag },
  { name: "Writers", to: ROUTES.WRITERS, icon: Users },
  { name: "Community", to: ROUTES.WRITING, icon: Feather },
];

const adminNav = [
  { name: "Dashboard", to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { name: "Users", to: ROUTES.ADMIN_USERS, icon: Users },
  { name: "Books", to: ROUTES.ADMIN_BOOKS, icon: BookMarked },
  { name: "Reviews", to: ROUTES.ADMIN_REVIEWS, icon: MessageCircle },
  { name: "Marketplace", to: ROUTES.ADMIN_MARKETPLACE, icon: ShoppingBag },
];

export default function Navbar() {
  const { user, hasRole } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const navItems = hasRole("admin") ? adminNav : baseNav;

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    navigate(
      query
        ? `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`
        : ROUTES.SEARCH
    );

    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <BookOpen size={20} />
            </div>

            <span className="font-bold text-lg text-slate-900 dark:text-white">
              BookVerse
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden xl:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm font-medium transition ${
                      isActive
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400"
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2"
            >
              <Search size={16} />

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books"
                className="ml-2 w-40 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </form>

            <ThemeToggle />

            {user ? (
              <Link
                to={ROUTES.PROFILE}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700"
              >
                <User size={16} />

                <span className="hidden 2xl:block max-w-24 truncate">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 text-slate-800 dark:text-white"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">

          <div className="p-4">

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mb-4 flex items-center rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2"
            >
              <Search size={16} />

              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </form>

            {/* Nav items */}
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-3 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}

          </div>

        </div>
      )}

    </header>
  );
}