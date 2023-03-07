<script>
    import {
      Dropdown,
      DropdownItem,
      DropdownMenu,
      DropdownToggle,
      Nav,
      NavItem,
      NavLink,
      Accordion,
      AccordionItem
    } from 'sveltestrap';
</script>
<nav class="sb-topnav navbar navbar-expand bg-white m-2" style="border-radius: 1rem;">
    <!-- Navbar Brand-->
    <a class="navbar-brand ps-3" href="index.html">Start Bootstrap</a>
    <!-- Sidebar Toggle-->
    <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
    <!-- Navbar Search-->
    <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div class="input-group">
            <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
            <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>
        </div>
    </form>
    <!-- Navbar-->
    <Dropdown>
        <DropdownToggle caret>User</DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Header</DropdownItem>
          <DropdownItem>Some Action</DropdownItem>
          <DropdownItem disabled>Action (disabled)</DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Foo Action</DropdownItem>
          <DropdownItem>Bar Action</DropdownItem>
          <DropdownItem>Quo Action</DropdownItem>
        </DropdownMenu>
      </Dropdown>
</nav>
<div id="layoutSidenav">
    <div id="layoutSidenav_nav">
        <Nav class="sb-sidenav accordion bg-white m-2" vertical style="border-radius: 1rem;" >
            <NavItem>
              <NavLink class="text-secondary" href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink class="text-secondary" href="#">Link</NavLink>
            </NavItem>
            <Accordion flush class="bg-dark">
                <AccordionItem header="Home" >
                    <NavLink class="text-secondary" href="#">Link</NavLink>
                    <NavLink class="text-secondary" href="#">Link</NavLink>
                </AccordionItem>
            </Accordion>
            <Accordion flush>
                <AccordionItem header="Others">
                    <NavLink class="text-secondary" href="#">Link</NavLink>
                    <NavLink class="text-secondary" href="#">Link</NavLink>
                </AccordionItem>
            </Accordion>
          </Nav>
       
    </div>
    <div id="layoutSidenav_content" class="m-2 p-3 bg-white" style="border-radius:1rem;">
        <slot>
            
        </slot>
    </div>
</div>