<script>
  //import { navigateTo } from "svelte-router-spa";
  import { onMount } from "svelte";
  //import { session } from "../services/store";
  import { request } from "../services/network";
  //request("/api/user/status")
  //admin true redirect to datasoruce + local storage
  //else redirect to login + delete local storage
  let user = {
    phone_country_code: "+91",
    phone: "9999991111",
    email: "test@spense.money",
    gender: "Male",
    age: "20",
    income: "50000",
    name: "Guest",
  };

  onMount(async () => {
    request("/api/auth/", "post", { user: user }).then((response) => {
      console.log(response);
    });
  });
</script>
