<script>
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardHeader from "sveltestrap/src/CardHeader.svelte";
  import CardFooter from "sveltestrap/src/CardFooter.svelte";
  import Form from "sveltestrap/src/Form.svelte";
  import FormGroup from "sveltestrap/src/FormGroup.svelte";
  import Label from "sveltestrap/src/Label.svelte";
  import Input from "sveltestrap/src/Input.svelte";
  import Button from "sveltestrap/src/Button.svelte";
  import {handleSubmit} from "../services/network.js";
  import { navigateTo } from "svelte-router-spa";
  function onSubmit(response){
    console.log(response);
    navigateTo("/");
  }
</script>

<div class="col-lg-5">
  <Card class="shadow-lg border-0 rounded-lg mt-5">
    <CardHeader>
      <h3 class="text-center font-weight-light my-4">Rester</h3>
    </CardHeader>
    <CardBody>
      <form action="/api/user/login" method="POST" encType="application/json" on:submit={(e)=>{e.preventDefault();handleSubmit(e,onSubmit)}}>
        <FormGroup>
          <Input
            type="email"
            name="username"
            id="exampleEmail"
            placeholder="Enter email address"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            placeholder="Enter password"
          />
        </FormGroup>

        <FormGroup
          class="d-flex align-items-center justify-content-between mt-4 mb-0"
        >
          <Button color="primary" type="submit">Login</Button>
        </FormGroup>
      </form>
    </CardBody>
  </Card>
</div>
