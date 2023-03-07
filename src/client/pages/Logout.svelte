<script>
  import { navigateTo } from "svelte-router-spa";
  import { onMount } from "svelte";
  import { session } from "../services/store";
  import { request } from "../services/network";
  onMount(async () => {
    request("/api/user/logout").then((response) => {
      navigateTo("/");
    });
  });
</script>
