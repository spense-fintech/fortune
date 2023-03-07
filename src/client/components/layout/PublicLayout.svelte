<script>
  import { Route } from "svelte-router-spa";
  import Container from "sveltestrap/src/Container.svelte";
  let title = "Application";
  export let currentRoute;
  const params = {};
  import Row from "sveltestrap/src/Row.svelte";
  import Footer from "../../components/Footer.svelte";
  import { Toast, ToastBody, ToastHeader } from "sveltestrap";
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

<div id="layoutAuthentication" class="bg-primary">
  <div id="layoutAuthentication_content">
    <main>
      <Container>
        <Row class="justify-content-center">
          <Container fluid={true}
            ><center><Route {currentRoute} {params} /></center></Container
          >
        </Row>
      </Container>
    </main>
  </div>
  <Footer />
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
