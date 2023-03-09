<script>
  //import { navigateTo } from "svelte-router-spa";
  import { onMount } from "svelte";
  //import { session } from "../services/store";
  import { request } from "../services/network";
  //request("/api/user/status")
  //admin true redirect to datasoruce + local storage
  //else redirect to login + delete local storage
  let user = {
    phone: 999999999,
    phone_country_code: 99,
    email: "test@spense.money",
    name: "Spense",
    gender: "Male",
    age: 20,
    income: 50000,
  };
  onMount(async () => {
    request("/api/auth", "post", { user: user }).then((response) => {
      console.log(response);
      /*console.log(response);
      if (response.hasOwnProperty("user")) {
        session.set(response.user);
        navigateTo("/datasource");
      } else {
        session.set({});
        navigateTo("login");
      }*/
    });
  });
</script>
