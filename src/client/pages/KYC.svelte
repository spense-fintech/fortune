<script>
  import { CardBody, CardHeader, FormGroup, Label, Button } from "sveltestrap";
  import Input from "sveltestrap/src/Input.svelte";
  import { onMount } from "svelte";
  import { request } from "../services/network.js";
  import { navigateTo } from "svelte-router-spa";

  let requiredFields = [];
  let bankList = getBankList();
  let user = {
    info: {
      basic_details: {
        full_name: "",
        gender: "",
        mobile_number: "",
        email: "",
        date_of_birth: "",
        marital_status: "",
        annual_income: "",
      },
      address: {
        city: "",
        state: "",
        country: "",
        pin: "",
        landmark: "",
        address_line_1: "",
      },
      identification: {
        pan_number: "",
        aadhar_number: "",
      },
      bank_account: {
        name: "",
        account_number: "",
        account_type: "",
        ifsc_code: "",
      },
    },
  };

  onMount(async () => {
    request("/api/userauth/session/", "GET").then((data) => {
      user = data.user;
      console.log(user);
    });
  });
  function getBankList() {
    // API Call to LenDen
    return [
      "BANK OF BARODA",
      "BASIN CATHOLIC BANK LIMITED",
      "CANADA BANK",
      "THE VARACHHA CO-OPERATIVE BANK",
    ];
  }

  let checkbox = false;
  async function handleKYC(e) {
    e.preventDefault();
    if (checkbox) {
      await request("/api/user", "PUT", user);
      navigateTo("/landing");
    } else {
      console.log("User has not confirmed the details");
    }
  }
</script>

<div
  class="form-container d-flex flex-column align-itens-center justify-content-center"
>
  <CardHeader>
    <h3 class="d-flex align-itens-center justify-content-center">Onboarding</h3>
  </CardHeader>
  <CardBody>
    <form on:submit={handleKYC}>
      <div class="row d-flex justify-content-around">
        <div class="col-sm-5 col-sm-pull-7">
          <Label for="name">Full Name</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              placeholder="Full Name"
              bind:value={user.info.basic_details.full_name}
              required
            />
          </FormGroup>
          <Label for="name">Gender</Label>
          <FormGroup>
            <Input
              type="select"
              name="datasource_id"
              required
              placeholder="Select"
              bind:value={user.info.basic_details.gender}
            >
              <option>MALE</option>
              <option>FEMALE</option>
              <option>OTHER</option>
            </Input>
          </FormGroup>
          <Label for="name">Mobile Number</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              readonly
              placeholder="Mobile Number"
              bind:value={user.phone}
            />
          </FormGroup>
          <Label for="name">Email</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              readonly
              placeholder="Email"
              bind:value={user.info.basic_details.email}
            />
          </FormGroup>
          <Label for="name">DOB</Label>
          <FormGroup>
            <Input
              type="date"
              name="datasource_id"
              required
              placeholder="DOB"
              bind:value={user.info.basic_details.date_of_birth}
            />
          </FormGroup>
          <Label for="name">Marital Status</Label>
          <FormGroup>
            <Input
              type="select"
              name="datasource_id"
              required
              placeholder="Marital Status"
              bind:value={user.info.basic_details.marital_status}
            >
              <option>MARRIED</option>
              <option>SINGLE</option>
              <option>DIVORCED</option>
              <option>WIDOWED</option>
            </Input>
          </FormGroup>
          <Label for="name">Annual Income</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Annual Income"
              bind:value={user.info.basic_details.annual_income}
            />
          </FormGroup>
          <Label for="name">City</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="City"
              bind:value={user.info.address.city}
            />
          </FormGroup>
          <Label for="name">State</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="State"
              bind:value={user.info.address.state}
            />
          </FormGroup>
          <Label for="name">Country</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Country"
              bind:value={user.info.address.country}
            />
          </FormGroup>
        </div>
        <div class="col-sm-5 col-sm-push-7">
          <Label for="name">Pin</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Pin"
              bind:value={user.info.address.pin}
            />
          </FormGroup>
          <Label for="name">Landmark</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Landmark"
              bind:value={user.info.address.landmark}
            />
          </FormGroup>
          <Label for="name">Address Line 1</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Address Line 1"
              bind:value={user.info.address.address_line_1}
            />
          </FormGroup>
          <Label for="name">Pan Number</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Pan Number"
              bind:value={user.info.identification.pan_number}
            />
          </FormGroup>
          <Label for="name">Aadhaar Number</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Aadhaar Number"
              bind:value={user.info.identification.aadhar_number}
            />
          </FormGroup>
          <Label for="name">Bank Name</Label>
          <FormGroup>
            <Input
              type="select"
              name="Bank Name"
              required
              placeholder="Bank Name"
              bind:value={user.info.bank_account.name}
            >
              <option>BANK OF BARODA</option>
              <option>BASIN CATHOLIC BANK LIMITED</option>
              <option>CANADA BANK</option>
              <option>THE VARACHHA CO-OPERATIVE BANK</option>
            </Input>
          </FormGroup>
          <Label for="name">Bank Account Number</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="Account Number"
              bind:value={user.info.bank_account.account_number}
            />
          </FormGroup>
          <Label for="name">Bank Account Type</Label>
          <FormGroup>
            <Input
              type="select"
              name="datasource_id"
              required
              placeholder="Account Type"
              bind:value={user.info.bank_account.account_type}
            >
              <option>SAVINGS</option>
              <option>CURRENT</option>
            </Input>
          </FormGroup>
          <Label for="name">Bank IFSC Code</Label>
          <FormGroup>
            <Input
              type="text"
              name="datasource_id"
              required
              placeholder="IFSC Code"
              bind:value={user.info.bank_account.ifsc_code}
            />
          </FormGroup>
          <div class="checkbox-field">
            <FormGroup>
              <Input
                id="c1"
                type="checkbox"
                required
                label="Above details provided are true to my knowledge"
                bind:checked={checkbox}
              />
            </FormGroup>
          </div>
        </div>
        <div class="submit-btn">
          <Button block type="submit">Submit</Button>
        </div>
      </div>
    </form>
  </CardBody>
</div>

<style>
  .checkbox-field {
    font-size: 20px;
    font-weight: 600;
    margin-top: 45px;
  }
  .submit-btn {
    width: 92%;
  }
</style>
