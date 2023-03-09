import Splash from "./pages/Splash.svelte";
import Landing from "./pages/Landing.svelte";
import SendToken from "./pages/SendToken.svelte";
import NotFound from "./pages/NotFound.svelte";
import KYC from "./pages/KYC.svelte";
import PublicLayout from "./components/layout/PublicLayout.svelte";
import DashboardLayout from "./components/layout/DashboardLayout.svelte";
import { session } from "./services/store";
import { get } from "svelte/store";

const routes = [
  {
    name: "/sendtoken",
    component: SendToken,
    layout: PublicLayout,
  },
  {
    name: "/kyc",
    component: KYC,
    layout: DashboardLayout,
  },
  {
    name: "/splash",
    component: Splash,
    layout: DashboardLayout,
  },
  {
    name: "/landing",
    component: Landing,
    layout: DashboardLayout,
  },
  {
    name: "404",
    path: "404",
    component: NotFound,
    layout: PublicLayout,
  },
];

export { routes };
