import { lazy, type ComponentType } from "react";

export type PageId =
  | "landing"
  | "products"
  | "howitworks"
  | "community"
  | "askexpert"
  | "flavourlab"
  | "youpick"
  | "about"
  | "impressum"
  | "privacy"
  | "terms"
  | "accessibility";

export interface RoutePageProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

interface RouteDefinition {
  id: PageId;
  path: string;
  component: ComponentType<RoutePageProps>;
  navigationLabel?: string;
}

export interface NavigationDefinition {
  id: PageId | "app";
  path: string;
  navigationLabel: string;
  documentNavigation?: boolean;
}

export const routes: RouteDefinition[] = [
  { id: "landing", path: "/", component: lazy(() => import("../pages/BossBabyLandingPage")) },
  { id: "products", path: "/products", navigationLabel: "Drinks", component: lazy(() => import("../pages/BossBabyProductsPage")) },
  { id: "howitworks", path: "/how-it-works", navigationLabel: "AI machine", component: lazy(() => import("../pages/BossBabyHowItWorksPage")) },
  { id: "community", path: "/community", navigationLabel: "Bossbabes", component: lazy(() => import("../pages/BossBabyCommunityPage")) },
  { id: "askexpert", path: "/ask-an-expert", component: lazy(() => import("../pages/BossBabyAskAnExpertPage")) },
  { id: "flavourlab", path: "/flavour-lab", component: lazy(() => import("../pages/BossBabyFlavourLabPage")) },
  { id: "youpick", path: "/you-pick", component: lazy(() => import("../features/you-pick/components/YouPickPage")) },
  { id: "about", path: "/about", navigationLabel: "About", component: lazy(() => import("../pages/BossBabyAboutPage")) },
  { id: "impressum", path: "/impressum", component: lazy(() => import("../pages/BossBabyImpressumPage")) },
  { id: "privacy", path: "/privacy", component: lazy(() => import("../pages/BossBabyPrivacyPage")) },
  { id: "terms", path: "/terms", component: lazy(() => import("../pages/BossBabyTermsPage")) },
  { id: "accessibility", path: "/accessibility", component: lazy(() => import("../pages/BossBabyAccessibilityPage")) },
];

const appNavigation: NavigationDefinition = {
  id: "app",
  path: "/app",
  navigationLabel: "App",
  documentNavigation: true,
};

export const navigationRoutes: NavigationDefinition[] = routes
  .filter((route): route is RouteDefinition & { navigationLabel: string } => Boolean(route.navigationLabel))
  .flatMap((route) => route.id === "about" ? [appNavigation, route] : [route]);
export const legalRoutes = routes.filter((route) =>
  (["impressum", "privacy", "terms", "accessibility"] as PageId[]).includes(route.id)
);

export function normalizePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getRouteByPath(pathname: string): RouteDefinition | undefined {
  const normalized = normalizePath(pathname);
  return routes.find((route) => route.path === normalized);
}

export function pagePath(page: PageId): string {
  return routes.find((route) => route.id === page)?.path ?? "/";
}
