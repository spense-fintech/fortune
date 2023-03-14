import { request } from "../services/network.js";
import { session } from "../services/store.js";

export async function p2pCall(APICode, user_id) {
  let user = {};
  const base_url = "https://partnersapi-qa.lendenclub.com/";
  const partner_name = "";
  //const apiURL = base_url + "v1/" + partner_name + "/";
  // const partner_name = "spense"

  await request("/api/user/" + user_id, "GET").then((data) => {
    session.set(data.user);
    if (data.hasOwnProperty("user")) {
      user = data.user;
    }
  });

  let APIBody = setAPIBody(APICode, user, partner_name);
  console.log(JSON.stringify(APIBody, null, "\t"));
  //API Call to lenden with APIBody as Post body
  //Decrypt the response and appropriate response
  //await request(apiURL, "POST", {body: APIBody}).then((res) => {});
  //Test code
  if (APICode == "CREATE_BASIC_DETAILS") {
    let response = {
      message: "User Created Successfully",
      response: {
        token: "89f0409dc920a0af5018e8501b0653b3bc26cc94",
        user_id: "PN623BH1L1",
        task_id: 812181,
      },
    };
    user.info.token = response.response.token;
    user.info.user_id = response.response.user_id;
    await request("/api/user", "PUT", user);
  }
}

function setAPIBody(APICode, user, partner_name) {
  const redirection_url = "";
  let APIBody = {
    params: {},
    fields: {},
    json: {},
    attributes: {},
    api_code: APICode,
  };
  switch (APICode) {
    case "CREATE_BASIC_DETAILS":
      APIBody.fields.basic_details = user.info.basic_details;
      APIBody.fields.address = user.info.address;
      APIBody.fields.identification = user.info.identification;
      APIBody.fields.bank_account = user.info.bank_account;
      break;
    case "BANK_LIST":
      break;
    case "INITIATE_KYC":
      APIBody.params.user_id = user.info.user_id;
      APIBody.attributes.Authorization = "Token " + user.info.token;
      let kyc_details = {
        name: user.info.basic_details.full_name,
        pan_number: user.info.identification.pan_number,
        aadhar_number: user.info.identification.aadhar_number,
        mobile_number: user.info.basic_details.mobile_number,
        date_of_birth: user.info.basic_details.date_of_birth,
      };
      APIBody.fields.kyc_details = kyc_details;
      APIBody.fields.user_id = user.info.user_id;
      APIBody.fields.vendor_key = partner_name;
      APIBody.fields.redirection_url = redirection_url;
      break;
    case "LEGAL_AUTHORIZATION":
      APIBody.fields.task_id = 811220;
      APIBody.fields.authorization_letter = true;
      APIBody.fields.rbi_compliance = true;
      APIBody.fields.user_id = user.info.user_id;
      break;
  }
  return APIBody;
}
