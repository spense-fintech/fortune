<script>
  import Navbar from "sveltestrap/src/Navbar.svelte";
  import NavbarBrand from "sveltestrap/src/NavbarBrand.svelte";
  import NavbarToggler from "sveltestrap/src/NavbarToggler.svelte";
  import Nav from "sveltestrap/src/Nav.svelte";
  import NavItem from "sveltestrap/src/NavItem.svelte";
  import NavLink from "sveltestrap/src/NavLink.svelte";
  import Collapse from "sveltestrap/src/Collapse.svelte";
  import Dropdown from "sveltestrap/src/Dropdown.svelte";
  import DropdownToggle from "sveltestrap/src/DropdownToggle.svelte";
  import DropdownMenu from "sveltestrap/src/DropdownMenu.svelte";
  import DropdownItem from "sveltestrap/src/DropdownItem.svelte";
  import ListGroup from "sveltestrap/src/ListGroup.svelte";
  import Form from "sveltestrap/src/Form.svelte";
  import InputGroup from "sveltestrap/src/InputGroup.svelte";
  //import InputGroupAddon from "sveltestrap/src/InputGroupAddon.svelte";
  import Label from "sveltestrap/src/Label.svelte";
  import Input from "sveltestrap/src/Input.svelte";
  //import CustomInput from "sveltestrap/src/CustomInput.svelte";
  import Button from "sveltestrap/src/Button.svelte";

  export let color;
  export let title;
  export let sideBarToggleClass;
  function searchHandle() {
    event.preventDefault();
  }
</script>

<Navbar class="sb-topnav navbar-expand" {color} dark expand="md">
  <div
    class="text-white"
    on:click={() => {
      if (sideBarToggleClass === "") {
        sideBarToggleClass = "sb-sidenav-toggled";
      } else {
        sideBarToggleClass = "";
      }
    }}
  >
    <i class="fa-solid fa-bars" />
  </div>
  <Nav class="ml-auto" navbar>
    <Form inline>
      <InputGroup>
        <Input
          type="search"
          name="search"
          id="exampleSearch"
          placeholder="Search for..."
        />
        <Button color="primary" on:click={searchHandle}>
          <i class="fas fa-search" />
        </Button>
      </InputGroup>
    </Form>
    <ListGroup class="ml-auto ml-md-0">
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>
          <i class="fas fa-user fa-fw ml-3" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            <a class="dropdown-item" href="/logout"> Logout </a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ListGroup>
  </Nav>
</Navbar>
