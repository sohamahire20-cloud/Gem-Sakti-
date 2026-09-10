import { Component, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import Lenis from "lenis";

import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { track } from "./lib/analytics";

import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import SearchModal from "./components/SearchModal";
import CartDrawer from "./components/CartDrawer";
import QuickView from "./components/QuickView";
import Footer from "./components/Footer";
import FloatingContactActions from "./components/FloatingContactActions";
import MobileBottomNav from "./components/MobileBottomNav";
import OmniAgent from "./components/OmniAgent";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CollectionsIndex from "./pages/CollectionsIndex";
import ProductPage from "./pages/ProductPage";
import QuizPage from "./pages/QuizPage";
import GiftsPage from "./pages/GiftsPage";
import IntentionsPage from "./pages/IntentionsPage";
import AboutPage from "./pages/AboutPage";
import JournalPage from "./pages/JournalPage";
import JournalPostPage from "./pages/JournalPostPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import PoliciesPage from "./pages/PoliciesPage";
import NotFound from "./pages/NotFound";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App error boundary:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
          <p className="eyebrow">GemSakti</p>
          <h1 className="mt-4 font-display text-4xl text-ivory">Something interrupted the experience.</h1>
          <p className="mt-3 max-w-[46ch] text-sm text-ivory/55">
            Please refresh the page. The rest of the store is fine — this section stumbled.
          </p>
          <button onClick={() => window.location.reload()} className="btn-gold mt-8">
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollAndTrack() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    track("page_view", { page_path: pathname });
  }, [pathname]);
  return null;
}

function LenisSetup() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}

function PoliciesRoute() {
  const { slug } = useParams();
  return <PoliciesPage slug={slug} />;
}

function Shell() {
  return (
    <div className="min-h-screen bg-ink">
      <AnnouncementBar />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<CollectionsIndex />} />
        <Route path="/collections/:handle" element={<Shop />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/gifts" element={<GiftsPage />} />
        <Route path="/intentions" element={<IntentionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:slug" element={<JournalPostPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/policies/:slug" element={<PoliciesRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <div className="h-16 bg-ebony lg:hidden" />
      <MobileBottomNav />
      <OmniAgent />
      <MobileMenu />
      <SearchModal />
      <CartDrawer />
      <QuickView />
      <FloatingContactActions />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <LenisSetup />
            <ScrollAndTrack />
            <Shell />
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
