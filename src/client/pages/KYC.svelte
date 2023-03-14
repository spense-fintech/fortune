<script>
  import { CardBody, CardHeader, FormGroup, Label } from "sveltestrap";
  import Input from "sveltestrap/src/Input.svelte";
  import { onMount } from "svelte";
  import { request } from "../services/network.js";
  import { navigateTo } from "svelte-router-spa";
  import Button from "../components/commons/Button.svelte";
  import dayjs from "dayjs";
  import { p2pCall } from "./function.js";
  //import { validateInput } from "./functions.js";

  let bankList = [];
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
      kyc_status: false,
    },
  };
  function formatDate() {
    let format = "YYYY-MM-DD";
    user.info.basic_details.date_of_birth = dayjs(
      user.info.basic_details.date_of_birth
    ).format(format);
  }

  onMount(async () => {
    request("/api/userauth/session/", "GET").then((data) => {
      user = data.user;
      formatDate();
      bankList = getBankList();
    });
  });
  function getBankList() {
    // API Call to LenDen
    p2pCall("BANK_LIST", user.user_id);
    return [
      "BANK OF BARODA",
      "BASIN CATHOLIC BANK LIMITED",
      "CANADA BANK",
      "THE VARACHHA CO-OPERATIVE BANK",
    ];
  }

  function isNum(str) {
    return /^\d+$/.test(str);
  }

  function validateInput() {
    let format = "DD/MM/YYYY";
    let panNumberRegex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
    let aadharNumberRegex = new RegExp(/^[0-9]{12}$/);
    let err = null;
    user.info.basic_details.date_of_birth = dayjs(
      user.info.basic_details.date_of_birth
    ).format(format);
    if (!isNum(user.info.address.pin) || user.info.address.pin.length != 6) {
      err = "Plase enter valid pin";
    }
    if (
      !isNum(user.info.bank_account.account_number) ||
      user.info.bank_account.account_number.length < 8 ||
      user.info.bank_account.account_number.length > 16
    ) {
      err = "Plase enter valid account number";
    }
    if (
      !isNum(user.info.bank_account.ifsc_code) ||
      user.info.bank_account.ifsc_code.length != 11
    ) {
      err = "Plase enter valid ifsc code";
    }
    if (!isNum(user.info.basic_details.annual_income)) {
      return (err = "Plase enter valid annual income");
    }
    if (panNumberRegex.test(user.info.identification.pan_number) == false) {
      err = "Plase enter valid pan number";
    }
    if (
      aadharNumberRegex.test(user.info.identification.aadhar_number) == false
    ) {
      err = "Plase enter valid aadhar number";
    }
    return err;
  }
  let checkbox = false;
  async function handleKYC(e) {
    e.preventDefault();
    if (!checkbox) {
      window.toast("Error", "Details not confirmed", "danger");
      //console.log("User has not confirmed the details");
    } else {
      let err = validateInput();
      if (err != null) {
        window.toast("Error", err, "danger");
        //console.log(err);
      } else {
        user.info.kyc_status = true;
        await request("/api/user", "PUT", user);
        await p2pCall("CREATE_BASIC_DETAILS", user.user_id);
        await p2pCall("INITIATE_KYC", user.user_id);
        navigateTo("/");
      }
    }
    formatDate();
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
              placeholder="Full Name"
              bind:value={user.info.basic_details.full_name}
              required
            />
          </FormGroup>
          <Label for="name">Gender</Label>
          <FormGroup>
            <Input
              type="select"
              required
              placeholder="Select"
              bind:value={user.info.basic_details.gender}
            >
              <option value="M">MALE</option>
              <option value="F">FEMALE</option>
              <option value="O">OTHER</option>
            </Input>
          </FormGroup>
          <Label for="name">Mobile Number</Label>
          <FormGroup>
            <Input
              type="text"
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
              required
              placeholder="DOB"
              bind:value={user.info.basic_details.date_of_birth}
            />
          </FormGroup>
          <Label for="name">Marital Status</Label>
          <FormGroup>
            <Input
              type="select"
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
              required
              placeholder="Annual Income"
              bind:value={user.info.basic_details.annual_income}
            />
          </FormGroup>
          <Label for="name">City</Label>
          <FormGroup>
            <Input
              type="text"
              required
              placeholder="City"
              bind:value={user.info.address.city}
            />
          </FormGroup>
          <Label for="name">State</Label>
          <FormGroup>
            <Input
              type="text"
              required
              placeholder="State"
              bind:value={user.info.address.state}
            />
          </FormGroup>
          <Label for="name">Country</Label>
          <FormGroup>
            <Input
              type="text"
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
              required
              placeholder="Pin"
              bind:value={user.info.address.pin}
            />
          </FormGroup>
          <Label for="name">Landmark</Label>
          <FormGroup>
            <Input
              type="text"
              required
              placeholder="Landmark"
              bind:value={user.info.address.landmark}
            />
          </FormGroup>
          <Label for="name">Address Line 1</Label>
          <FormGroup>
            <Input
              type="text"
              required
              placeholder="Address Line 1"
              bind:value={user.info.address.address_line_1}
            />
          </FormGroup>
          <Label for="name">Pan Number</Label>
          <FormGroup>
            <Input
              type="text"
              required
              placeholder="Pan Number"
              bind:value={user.info.identification.pan_number}
            />
          </FormGroup>
          <Label for="name">Aadhaar Number</Label>
          <FormGroup>
            <Input
              type="text"
              required
              placeholder="Aadhaar Number"
              bind:value={user.info.identification.aadhar_number}
            />
          </FormGroup>
          <Label for="name">Bank Name</Label>
          <FormGroup>
            <Input
              type="select"
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
              required
              placeholder="Account Number"
              bind:value={user.info.bank_account.account_number}
            />
          </FormGroup>
          <Label for="name">Bank Account Type</Label>
          <FormGroup>
            <Input
              type="select"
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
          <Button title="Submit and Confirm KYC" />
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
