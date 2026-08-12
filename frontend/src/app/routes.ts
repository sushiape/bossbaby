import { lazy, type ComponentType } from "react";

export type PageId =
  | "landing"
  | "products"
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

export const routes: RouteDefinition[] = [
  { id: "landing", path: "/", component: lazy(() => import("../pages/BossBabyLandingPage")) },
  { id: "products", path: "/products", navigationLabel: "Products", component: lazy(() => import("../pages/BossBabyProductsPage")) },
  { id: "youpick", path: "/you-pick", component: lazy(() => import("../features/you-pick/components/YouPickPage")) },
  { id: "about", path: "/about", navigationLabel: "About", component: lazy(() => import("../pages/BossBabyAboutPage")) },
  { id: "impressum", path: "/impressum", component: lazy(() => import("../pages/BossBabyImpressumPage")) },
  { id: "privacy", path: "/privacy", component: lazy(() => import("../pages/BossBabyPrivacyPage")) },
  { id: "terms", path: "/terms", component: lazy(() => import("../pages/BossBabyTermsPage")) },
  { id: "accessibility", path: "/accessibility", component: lazy(() => import("../pages/BossBabyAccessibilityPage")) },
];

export const navigationRoutes = routes.filter((route) => route.navigationLabel);
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
