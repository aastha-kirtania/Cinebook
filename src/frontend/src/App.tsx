import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { SeatsPage } from "./pages/SeatsPage";
import {
  ContactUsPage,
  HelpCenterPage,
  RefundPolicyPage,
  TermsPage,
} from "./pages/SupportPages";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cinema-bg">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export const rootRoute = createRootRoute({ component: Layout });

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

export const movieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movie/$id",
  component: MovieDetailPage,
});

export const seatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seats/$showtimeId",
  component: SeatsPage,
});

export const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmation/$bookingId",
  component: ConfirmationPage,
});

export const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

export const helpCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/help-center",
  component: HelpCenterPage,
});

export const refundPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/refund-policy",
  component: RefundPolicyPage,
});

export const contactUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact-us",
  component: ContactUsPage,
});

export const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  movieRoute,
  seatsRoute,
  confirmationRoute,
  myBookingsRoute,
  helpCenterRoute,
  refundPolicyRoute,
  contactUsRoute,
  termsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
