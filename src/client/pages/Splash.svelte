<script>
  import { navigateTo } from "svelte-router-spa";
  import { request } from "../services/network.js";
  import { session } from "../services/store.js";
  request("/api/userauth/session/", "GET").then((data) => {
    session.set(data);
    console.log(data);
    if (data.hasOwnProperty("user") && data.user.joined) {
      if (
        JSON.stringify(data.user.info.address) != "{}" &&
        JSON.stringify(data.user.info.identification) != "{}" &&
        JSON.stringify(data.user.info.bank_account) != "{}" &&
        data.user.info.kyc_status != false
      ) {
        //navigateTo("/Home");
        console.log("Welcome you user");
      } else {
        //navigateTo("/Onboarding");
        // KYC?
        //user.info["kyc_status"] = true;
        navigateTo("/kyc");
      }
    } else {
      navigateTo("/onboarding");
    }
  });
</script>
