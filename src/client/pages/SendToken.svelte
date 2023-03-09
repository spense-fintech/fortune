<script>
  //import { navigateTo } from "svelte-router-spa";
  import { onMount } from "svelte";
  //import { session } from "../services/store";
  import { request } from "../services/network";
  //request("/api/user/status")
  //admin true redirect to datasoruce + local storage
  //else redirect to login + delete local storage
  let user = {
    name: "abc",
    age: 20,
    gender: "female",
  };

  onMount(async () => {
    request("/api/auth/", "post", { user: {} }).then((response) => {
      console.log(response);
    });
  });
</script>
