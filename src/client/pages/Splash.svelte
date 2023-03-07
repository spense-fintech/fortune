<script>
  import { navigateTo } from "svelte-router-spa";
  import { onMount } from "svelte";
  import { session } from "../services/store";
  import { request } from "../services/network";
  //request("/api/user/status")
  //admin true redirect to datasoruce + local storage
  //else redirect to login + delete local storage
  onMount(async () => {
    const token = "abc";
    //console.log("http://localhost:3000/api/auth/" + token);
    request("/api/auth/" + token).then((response) => {
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
