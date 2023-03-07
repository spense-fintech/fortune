<script>
  import { onMount } from "svelte";
  let path = "";
  onMount(() => {
    path = window.location.pathname;
  });
  import Nav from "sveltestrap/src/Nav.svelte";
  import SidebarItem from "./SidebarItem.svelte";
  export let theme;
  $: sidenav_theme = `sb-sidenav-${theme}`;
  let menus = [
    /*{
      title: "Admin",
      icon: "fa-users",
      menus: [
        {
          title: "User",
          icon: "fa-users",
          url: "/users",
        },
        {
          title: "Account Profile",
          icon: "fa-users",
          url: "/users",
        },
      ],
    },*/
    { title: "Datasource", icon: "fa-database", url: "/" },
  ];
</script>

<div id="layoutSidenav_nav" class="sb-nav-fixed">
  <Nav
    class="sb-sidenav {sidenav_theme} accordion sb-nav-fixed"
    id="sidenavAccordion"
  >
    <div class="sb-sidenav-menu" style="overflow-x: hidden!important; ">
      {#each menus as menu}
        <SidebarItem {menu} {path} />
      {/each}
    </div>
  </Nav>
</div>
