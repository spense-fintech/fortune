import Splash from "./pages/Splash.svelte";
import NotFound from "./pages/NotFound.svelte";
import PublicLayout from "./components/layout/PublicLayout.svelte";
import { session } from "./services/store";
import { get } from "svelte/store";

function isLoggedIn() {
  const userSession = get(session);
  return userSession.hasOwnProperty("admin_login");
}
function isNotLoggedIn() {
  return !isLoggedIn();
}
const routes = [
  {
    name: "/",
    component: Splash,
    layout: PublicLayout,
  },
  {
    name: "404",
    path: "404",
    component: NotFound,
    layout: PublicLayout,
  },
];

export { routes };
