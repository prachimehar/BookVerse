import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import { ROUTES } from "./constants/routes";
import { ROLES } from "./constants/roles";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import Navbar from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { WriterSidebar } from "./components/layout/WriterSidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import BookReader from "./pages/BookReader";
import Search from "./pages/Search";
import Writing from "./pages/Writing";
import Library from "./pages/Library";
import Purchases from "./pages/Purchases";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import SellBook from "./pages/SellBook";
import MarketplaceDetails from "./pages/MarketplaceDetails";
import MyListings from "./pages/MyListings";
import Writers from "./pages/Writers";
import WriterDashboard from "./pages/WriterDashboard";
import WriterBooks from "./pages/WriterBooks";
import WriterWriting from "./pages/WriterWriting";
import WriterCreateBook from "./pages/WriterCreateBook";
import WriterEditBook from "./pages/WriterEditBook";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBooks from "./pages/AdminBooks";
import AdminReviews from "./pages/AdminReviews";
import AdminMarketplace from "./pages/AdminMarketplace";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";

function App() {
  const { user, hasRole } = useAuth();
  const { pathname } = useLocation();
  const isWriterRoute = pathname === "/writer" || pathname.startsWith("/writer/");
  const showWriterSidebar = user && hasRole(ROLES.WRITER) && isWriterRoute;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 transition-colors duration-300 dark:bg-[#0F172A] dark:text-slate-100">
      {user && <Navbar />}
      <main className={`mx-auto w-full px-4 pb-16 pt-6 sm:px-6 lg:px-8 ${showWriterSidebar ? "max-w-[1500px]" : "max-w-[1320px]"}`}>
        <div className={showWriterSidebar ? "grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]" : ""}>
          {showWriterSidebar && <WriterSidebar />}
          <div className="min-w-0">
            <Routes>
              <Route
                path={ROUTES.HOME}
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route
                path={ROUTES.BOOKS}
                element={<Books />}
              />
              <Route
                path={ROUTES.WRITERS}
                element={<Writers />}
              />
              <Route
                path={ROUTES.BOOK_DETAILS}
                element={<BookDetails />}
              />
              <Route
                path={ROUTES.BOOK_READ}
                element={
                  <ProtectedRoute>
                    <BookReader />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SEARCH}
                element={<Search />}
              />
              <Route
                path={ROUTES.WRITING}
                element={<Writing />}
              />
              <Route
                path={ROUTES.LIBRARY}
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PURCHASES}
                element={
                  <ProtectedRoute>
                    <Purchases />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MARKETPLACE}
                element={<Marketplace />}
              />
              <Route
                path={ROUTES.MARKETPLACE_SELL}
                element={
                  <ProtectedRoute>
                    <SellBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MARKETPLACE_DETAILS}
                element={<MarketplaceDetails />}
              />
              <Route
                path={ROUTES.MARKETPLACE_MY_LISTINGS}
                element={
                  <ProtectedRoute>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.WRITER_DASHBOARD}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.WRITER]}>
                    <WriterDashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.WRITER_BOOKS}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.WRITER]}>
                    <WriterBooks />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.WRITER_WRITING}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.WRITER]}>
                    <WriterWriting />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.WRITER_CREATE_BOOK}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.WRITER]}>
                    <WriterCreateBook />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.WRITER_EDIT_BOOK}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.WRITER]}>
                    <WriterEditBook />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN_DASHBOARD}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <AdminDashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN_USERS}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <AdminUsers />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN_BOOKS}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <AdminBooks />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN_REVIEWS}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <AdminReviews />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN_MARKETPLACE}
                element={
                  <RoleProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <AdminMarketplace />
                  </RoleProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
              <Route
                path={ROUTES.CHECKOUT}
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
         

         console.log("API URL:", import.meta.env.VITE_API_URL);
      </main>
      {user && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
