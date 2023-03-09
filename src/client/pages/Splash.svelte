<script>
<<<<<<< HEAD
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
=======
  import { navigateTo } from "svelte-router-spa";
  import { request } from "../services/network.js";
  import { session } from "../services/store.js";
  request("/api/userauth/session/", "GET").then((data) => {
    session.set(data);
    if (data.hasOwnProperty("user") && data.user.joined) {
      if (
        JSON.stringify(data.user.info.address) != "{}" &&
        JSON.stringify(data.user.info.identification) != "{}" &&
        JSON.stringify(data.user.info.bank_account) != "{}" &&
        data.user.info.kyc_status != false
      ) {
        //navigateTo("/Home");
        console.log("Welcome you user");
>>>>>>> 6a8b40e8bbf5aa8942c2ae680e59576cfdd03938
      } else {
        //navigateTo("/Onboarding");
        // KYC?
        //user.info["kyc_status"] = true;
        navigateTo("/kyc");
      }
    } else {
      navigateTo("/landing");
    }
  });
</script>
