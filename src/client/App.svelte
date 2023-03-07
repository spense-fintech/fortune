<script>
  import { Router } from "svelte-router-spa";
  import { routes } from "./routes";
  export let currentRoute;
  const params = {};
</script>

<Router {routes} {currentRoute} {params} />
