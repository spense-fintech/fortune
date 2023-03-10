<script>
  import { navigateTo } from "svelte-router-spa";
  import { request } from "../services/network.js";
  import { session } from "../services/store.js";

  function anyFieldEmpty(user) {
    let details = user.info;
    for (const objs in details) {
      if (objs != "identification") {
        for (const field in details[objs]) {
          if (details[objs][field] == "") {
            return false;
          }
        }
      }
    }
    if (user.info.kyc_status == false) {
      return false;
    }
    return true;
  }

  request("/api/userauth/session/", "GET").then((data) => {
    session.set(data);
    //console.log(data);
    if (data.hasOwnProperty("user") && data.user.joined) {
      if (anyFieldEmpty(data.user)) {
        navigateTo("/home");
      } else {
        navigateTo("/kyc");
      }
    } else {
      navigateTo("/landing");
    }
  });
</script>
