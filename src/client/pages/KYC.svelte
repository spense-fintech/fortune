<script>
  import { Card, CardBody, CardHeader, FormGroup, Label } from "sveltestrap";
  import Input from "sveltestrap/src/Input.svelte";
  import { onMount } from "svelte";

  let requiredFields = [];
  let bankList = getBankList();
  let user = {};

  onMount(async () => {
    request("/api/userauth/session/", "GET").then((data) => {
      user = data.user;
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
  /**
   * bind:value={user.info.basic_details.full_name}
   * bind:value={user.info.basic_details.gender}
   * bind:value={user.info.basic_details.mobile_number}
   * bind:value={user.info.basic_details.email}
   * bind:value={user.info.basic_details.date_of_birth}
   * bind:value={user.info.basic_details.marital_status}
   * bind:value={user.info.basic_details.annual_income}
   * bind:value={user.info.address.city}
   * bind:value={user.info.address.state}
   * bind:value={user.info.address.country}
   * bind:value={user.info.address.pin}
   * bind:value={user.info.address.landmark}
   * bind:value={user.info.address.address_line_1}
   * bind:value={user.info.identification.pan_number}
   * bind:value={user.info.identification.aadhar_number}
   * bind:value={user.info.bank_account.name}
   * bind:value={user.info.bank_account.account_number}
   * bind:value={user.info.bank_account.account_type}
   * bind:value={user.info.bank_account.ifsc_code}
   */
</script>

<div class="form-container">
  <CardHeader>
    <h3>Onboarding</h3>
  </CardHeader>
  <CardBody>
    <form>
      <Label for="name">Full Name</Label>
      <FormGroup>
        <Input
          type="text"
          name="datasource_id"
          placeholder="Full Name"
          required
        />
      </FormGroup>
      <Label for="name">Gender</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" required placeholder="Gender">
          <option>M</option>
          <option>F</option>
          <option>O</option>
        </Input>
      </FormGroup>
      <Label for="name">Mobile Number</Label>
      <FormGroup>
        <Input
          type="text"
          name="datasource_id"
          required
          placeholder="Mobile Number"
        />
      </FormGroup>
      <Label for="name">Email</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" required placeholder="Email" />
      </FormGroup>
      <Label for="name">DOB</Label>
      <FormGroup>
        <Input type="date" name="datasource_id" placeholder="DOB" />
      </FormGroup>
      <Label for="name">Marital Status</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" placeholder="Marital Status">
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
        />
      </FormGroup>
      <Label for="name">City</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" required placeholder="City" />
      </FormGroup>
      <Label for="name">State</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" required placeholder="State" />
      </FormGroup>
      <Label for="name">Country</Label>
      <FormGroup>
        <Input
          type="text"
          name="datasource_id"
          required
          placeholder="Country"
        />
      </FormGroup>
      <Label for="name">Pin</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" required placeholder="Pin" />
      </FormGroup>
      <Label for="name">Landmark</Label>
      <FormGroup>
        <Input
          type="text"
          name="datasource_id"
          required
          placeholder="Landmark"
        />
      </FormGroup>
      <Label for="name">Address Line 1</Label>
      <FormGroup>
        <Input
          type="text"
          name="datasource_id"
          required
          placeholder="Address Line 1"
        />
      </FormGroup>
      <Label for="name">Pan Number</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" placeholder="Pan Number" />
      </FormGroup>
      <Label for="name">Aadhaar Number</Label>
      <FormGroup>
        <Input type="text" name="datasource_id" placeholder="Aadhar Number" />
      </FormGroup>
      <Label for="name">Bank Name</Label>
      <FormGroup>
        <Input type="select" name="Bank Name" placeholder="Bank Name" required>
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
        />
      </FormGroup>
      <Label for="name">Bank Account Type</Label>
      <FormGroup>
        <Input
          type="text"
          name="datasource_id"
          required
          placeholder="Account Type"
        >
          <option>SAVING</option>
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
        />
      </FormGroup>
    </form>
  </CardBody>
</div>
