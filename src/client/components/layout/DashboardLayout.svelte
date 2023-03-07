<script>
  import { Route } from "svelte-router-spa";

  import Container from "sveltestrap/src/Container.svelte";
  import Navbar from "../Navbar.svelte";
  import Sidebar from "../Sidebar.svelte";
  import Footer from "../Footer.svelte";
  import { Toast, ToastBody, ToastHeader } from "sveltestrap";
  let theme = "dark";
  let color = "dark";
  let title = "Application";
  let sideBarToggleClass = "";
  export let currentRoute;
  const params = {};
  let isOpen = false;
  let toast_type = "info";
  let toast_message = "";
  let toast_header = "";
  function toggle() {
    isOpen = !isOpen;
  }
  function toast(title, message, type = "default") {
    isOpen = false;
    toast_type = type;
    toast_header = title;
    toast_message = message;
    toggle();
  }
  window.toast = toast;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div class="sb-nav-fixed {sideBarToggleClass}">
  <Navbar {color} {title} bind:sideBarToggleClass />
  <div id="layoutSidenav">
    <Sidebar {theme} />
    <div id="layoutSidenav_content">
      <main>
        <Container fluid={true}><Route {currentRoute} {params} /></Container>
      </main>
      <Footer />
    </div>
  </div>
  <div id="snackbar" class=" m-3 position-fixed bottom-0 end-0">
    <Toast autohide {isOpen} on:close={() => (isOpen = false)}>
      <ToastHeader class="bg-{toast_type} text-white" {toggle}
        >{toast_header}</ToastHeader
      >
      <ToastBody>
        {toast_message}
      </ToastBody>
    </Toast>
  </div>
</div>
