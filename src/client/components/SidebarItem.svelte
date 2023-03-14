<!-- <script>
  import Collapse from "sveltestrap/src/Collapse.svelte";
  import Nav from "sveltestrap/src/Nav.svelte";
  export let menu = { title: "", icon: "", url: "javascript:void(0)" };
  export let path = "/";
  export let isOpen = false;
</script>

{#if menu.menus === undefined}
  <a class="nav-link {path === menu.url ? 'active' : ''}" href={menu.url}>
    <span class="item">
      {#if menu.icon != ""}
        <i class="fas {menu.icon}" />
      {/if}

      {menu.title}
    </span>
  </a>
{:else}
  <div
    class="nav-link"
    on:click={() => {
      isOpen = !isOpen;
    }}
  >
    {#if menu.icon != ""}
      <i class="fas {menu.icon}" />
    {/if}
    <span class="item">
      {menu.title}
    </span>
    <i class="fas fa-angle-down float-end" />
    <Collapse {isOpen}>
      <Nav class="sb-sidenav-menu-nested">
        {#each menu.menus as menuItem}
          <svelte:self menu={menuItem} {path} />
        {/each}
      </Nav>
    </Collapse>
  </div>
{/if}

<style>
  .item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style> -->
