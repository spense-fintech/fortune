<script>
  import { Card } from "sveltestrap";
  // import Button from "sveltestrap/src/Button.svelte";
  import RangeSlider from "../components/commons/RangeSlider.svelte";
  import ButtonGroup from "../components/commons/ButtonGroup.svelte";
  import Button from "../components/commons/Button.svelte";
  import { onMount } from "svelte";

  let amountIndex = 4;
  let durationIndex = 3;
  let interestIndex = 0;
  let interestArray = [11.95];
  let selectedPlan = 12;
  let result = { maturityAmount: 0, investedAmount: 0, interest: 0 };

  let amountArray = [
    1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000,
    50000000,
  ];
  let amountArrayText = [
    "₹1,000",
    "₹5,000",
    "₹10,000",
    "₹50,000",
    "₹1,00,000",
    "₹5,00,000",
    "₹10,00,000",
    "₹50,00,000",
    "₹1,00,00,000",
    "₹5,00,00,000",
  ];

  let durationArray = [
    30, 61, 91, 122, 152, 183, 213, 243, 274, 304, 335, 365, 730, 1095, 1825,
    3650, 5475, 7300, 10950, 14600,
  ];
  let durationArrayText = [
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "5 months",
    "6 months",
    "7 months",
    "8 months",
    "9 months",
    "10 months",
    "11 months",
    "1 year",
    "2 years",
    "3 years",
    "5 years",
    "10 years",
    "15 years",
    "20 years",
    "30 years",
    "40 years",
  ];
  let data = [
    {
      group: "Investment",
      date: "2018-12-31T18:30:00.000Z",
      value: 50000,
    },
    {
      group: "Investment",
      date: "2019-01-07T18:30:00.000Z",
      value: 10000,
    },
    {
      group: "Interest",
      date: "2018-12-31T18:30:00.000Z",
      value: 20000,
    },
    {
      group: "Interest",
      date: "2019-01-07T18:30:00.000Z",
      value: 60000,
    },
  ];
  function valueChanged() {
    let data_new = [];
    console.log(
      selectedPlan,
      amountArray[amountIndex],
      durationArray[durationIndex],
      interestArray[interestIndex]
    );

    let investmentTotal = amountArray[amountIndex];
    let contributionTotal = amountArray[amountIndex];
    let interestTotal = 0;
    let date = new Date();
    let dayChange = Math.floor(365 / (selectedPlan != -1 ? selectedPlan : 12));
    data_new.push({
      group: "Investment",
      date: date.toISOString(),
      value: contributionTotal,
    });
    data_new.push({
      group: "Interest",
      date: date.toISOString(),
      value: 0,
    });
    let periods = Math.round(
      (durationArray[durationIndex] *
        (selectedPlan != -1 ? selectedPlan : 12)) /
        365
    );
    let divisor = Math.ceil(periods / 50);
    console.log("period", periods, divisor);
    for (let i = 1; i < periods; i++) {
      let interestPeriod =
        investmentTotal *
        (interestArray[interestIndex] /
          ((selectedPlan != -1 ? selectedPlan : 12) * 100));

      investmentTotal =
        investmentTotal +
        (selectedPlan != -1 ? amountArray[amountIndex] : 0) +
        interestPeriod;
      interestTotal = interestTotal + interestPeriod;

      contributionTotal =
        contributionTotal + (selectedPlan != -1 ? amountArray[amountIndex] : 0);
      date.setDate(date.getDate() + dayChange);
      if (i % divisor === 0) {
        data_new.push({
          group: "Investment",
          date: date.toISOString(),
          value: contributionTotal,
        });
        data_new.push({
          group: "Interest",
          date: date.toISOString(),
          value: interestTotal,
        });
      }
    }
    investmentTotal =
      investmentTotal +
      investmentTotal *
        (interestArray[interestIndex] /
          ((selectedPlan != -1 ? selectedPlan : 12) * 100));
    interestTotal =
      interestTotal +
      investmentTotal *
        (interestArray[interestIndex] /
          ((selectedPlan != -1 ? selectedPlan : 12) * 100));

    data_new.push({
      group: "Investment",
      date: date.toISOString(),
      value: contributionTotal,
    });
    data_new.push({
      group: "Interest",
      date: date.toISOString(),
      value: interestTotal,
    });
    console.log(investmentTotal, interestTotal, dayChange);

    result.maturityAmount = investmentTotal.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    });
    result.investedAmount = contributionTotal.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
      style: "currency",
      currency: "INR",
    });
    result.interest = interestTotal.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    });
    updateData(data_new);
  }
  async function updateData(data_new) {
    data = [...data_new];
  }
  onMount(async () => {
    valueChanged();
  });
</script>

<div
  class="landing-page-container"
  style="max-width:100%;width:480px; margin:auto;"
>
  <Card style="border-radius:30px; margin-top:3%; margin-bottom:5%;">
    <div class="fortune-background">
      <div class="col circular-background">
        <img
          class="fortune-heading"
          src="/assets/images/fortune_heading.svg"
          alt="heading"
        />

        <div class="col interest-headers">
          <h2 class="alignleft">Earn up to</h2>
          <img
            class="fortune-interest"
            src="/assets/images/$120k.svg"
            alt="11.95%"
          />
          <h2 style="float:right;">interest p.a</h2>
        </div>
        <div
          class="col features-column"
          style="margin-top:20%; margin-bottom:5%;"
        >
          <div class="row feature">
            <img
              class="feature-images"
              src="/assets/images/account_balance_wallet.svg"
              alt="wallet"
            />
            <div class="col features-text">
              <span>Save small, earn big</span>
              <p class="mb-4">
                First time ever, earn like the ultra rich with just investing
                ₹100/day.
              </p>
            </div>
          </div>
          <div class="row features">
            <img
              class="feature-images"
              src="/assets/images/percent.svg"
              alt="wallet"
            />
            <div class="col features-text">
              <span>Earn interest every day</span>
              <p class="mb-4">
                Make every day count with daily interest on your savings.
              </p>
            </div>
          </div>
          <div class="row features">
            <img
              class="feature-images"
              src="/assets/images/tab_move.svg"
              alt="wallet"
            />
            <div class="col features-text">
              <span>Withdraw anytime</span>
              <p class="mb-5">
                Take control of your finances, withdraw your money anytime,
                anywhere.
              </p>
            </div>
          </div>
          <Button title="Apply for early access" />
        </div>

        <!-- <Button
          style="border-radius:35px; width:80%; margin-left: auto; margin-right:auto; display:block; background-color: transparent; border: 2px solid white;"
          >Apply for early access</Button
        > -->
      </div>
    </div>
    <div class="col partnership-container">
      <h5>In partnership with India’s largest P2P lending platform</h5>
      <img
        src="/assets/images/lenden_logo.svg"
        alt="LenDen"
        style="max-width:300px; height:auto; width:40%; margin:auto; display:block;"
      />
      <p>
        An exclusive peer to peer investment designed in partnership with
        Lendenclub. Your investment is lent to creditworthy borrowers, to earn
        you high interest.
      </p>
      <div class="row regulated-by" style="margin-top:5%;">
        <div class="col">
          <img
            src="/assets/images/SEBI_logo.svg"
            alt="Regulated by SEBI"
            style="max-width:230px; max-height:200px; width:100%; margin:auto; display:block; padding-top:10%"
          />
        </div>
        <div class="col">
          <img
            src="/assets/images/RBI_logo.svg"
            alt="RBI Registered"
            style="max-width:220px; max-height:200px; width:80%; margin:auto; display:block;padding-top:6%"
          />
        </div>
        <div class="col">
          <img
            src="/assets/images/Trusted_users.svg"
            alt="Trusted by 80L"
            style="max-width:210px; max-height:200px; width:90%; margin:auto; display:block;padding-top:5%"
          />
        </div>
      </div>
    </div>
    <div class="feature-container">
      <div class="col">
        <img src="/assets/images/coin_wallet.svg" alt="Low saving" />
        <h5>Save as low as ₹100</h5>
        <p>
          Worried about huge investments? Save as low as ₹100 per day and earn
          12% p.a. Choose between daily, weekly or monthly auto-saving plans.
        </p>
      </div>
    </div>
    <div class="feature-container" style="background-color:white;">
      <div class="col">
        <img src="/assets/images/calendar.svg" alt="Low saving" />
        <h5>Start with just a 3 month plan.</h5>
        <p>
          Worried about long term commitment? Start with just a 3 months plans.
          Earn up to 10% p.a. In just 3 months. Your gains on your clock.
        </p>
      </div>
    </div>
    <div class="feature-container">
      <div class="col">
        <img src="/assets/images/beat_the_market.svg" alt="Low saving" />
        <h5>Beat the market and the index.</h5>
        <p>
          Looking to beat inflation and the index? Invest for long term and earn
          11.95% returns p.a consistently and make money work for you.
        </p>
      </div>
    </div>
    <div class="earnings-calculator" style="height:700px; padding: 5%;">
      <h4 style="font-weight:600;">Earnings Calculator</h4>

      <div class="mt-5">
        <span class="fw-semibold">Plan</span>

        <div class="mb-4 mt-3">
          <ButtonGroup
            bind:selected={selectedPlan}
            onChange={valueChanged}
            data={[
              { label: "Daily", value: 365 },
              { label: "Weekly", value: 52 },
              { label: "Monthly", value: 12 },
              { label: "Yearly", value: 1 },
              { label: "One-time", value: -1 },
            ]}
          />
        </div>
        <div />
      </div>
      <div class="slider">
        <div>
          <span class="fw-semibold">Investment</span>
          <RangeSlider
            data={amountArrayText}
            bind:defaultIndex={amountIndex}
            onChange={valueChanged}
          />
        </div>
        <div>
          <span class="fw-semibold">Duration</span>
          <RangeSlider
            data={durationArrayText}
            bind:defaultIndex={durationIndex}
            onChange={valueChanged}
          />
        </div>
        <!-- <div>
          <span class="fw-semibold">Rate of Interest</span>
          <RangeSlider
            data={interestArrayText}
            bind:defaultIndex={interestIndex}
            onChange={valueChanged}
          />
        </div> -->
      </div>
      <div class="row investment">
        <span class="investment-text">Get</span>
        <span class="maturity_amt fw-bold fs-1">{result.maturityAmount}</span>
        <div class="d-flex gap-4">
          <span class="investment-text">Invested: {result.investedAmount}</span>
          <span class="investment-text"
            >Interest: {result.interest} calc. for SIP</span
          >
        </div>
        <span class="investment-text mt-2"
          >*Earnings are calculated at 11.95% p.a.</span
        >
      </div>
    </div>
    <div
      class="market-comparision-container"
      style="padding: 5%; background-color:rgba(243, 241, 248, 1);"
    >
      <h4 style="font-weight:600;">Earn like the ultra-rich</h4>
      <p>
        Forget about huge investments, for the first time in India earn like the
        ultra-rich with just ₹100 a day.
      </p>
      <div class="row" style="margin-top:5%;">
        <div class="col" />
        <p class="col">Interest p.a</p>
        <p class="col">Min. investment</p>
      </div>
      <div style="height:0.2vw; background-color: rgba(177, 163, 205, 1);" />
      <div class="row comparision-row" style="background-color: ">
        <img class="col" src="/assets/images/spense_logo.svg" alt="Spense" />
        <p class="col" style="margin-top: 4%">11.95%</p>
        <p class="col" style="margin-top: 4%">&#8377;100 per day</p>
      </div>
      <div class="row" style="margin-top: 4%">
        <img
          class="col"
          src="/assets/images/bharatPe_logo.svg"
          alt="bharatPe"
        />
        <p class="col" style="margin-top: 4%">11.25%</p>
        <p class="col" style="margin-top: 4%">&#8377;10,000</p>
      </div>
      <div class="row">
        <img class="col" src="/assets/images/cred_logo.svg" alt="Cred" />
        <p class="col" style="margin-top: 4%">9.0%</p>
        <p class="col" style="margin-top: 4%">&#8377;10,000</p>
      </div>
      <div class="row">
        <img class="col" src="/assets/images/fi_logo.svg" alt="Fi" />
        <p class="col" style="margin-top: 4%">9.0%</p>
        <p class="col" style="margin-top: 4%">&#8377;10,000</p>
      </div>
    </div>
    <div
      class="coming-soon"
      style="padding: 5%; background-color:rgba(216, 209, 230, 1);"
    >
      <h4 style="font-weight:600;">Coming soon</h4>
      <p style="margin-bottom:10%;">
        The future is now with Spense Fortune. Don't miss out on being one of
        the first to enjoy its groundbreaking benefits.
      </p>
      <!-- <Button
        style="width:90%; border-radius:30px; background-color:rgba(53, 7, 147, 1); margin:auto;display:block; height: 40%;"
        >Apply for early access</Button
      > -->
      <Button title="Apply for early access" />
    </div>
  </Card>
</div>

<style>
  .coming-soon {
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  .comparision-row {
    margin: 5% auto auto auto;
    padding-top: 6%;
    background-color: rgba(216, 209, 230, 1);
    border-radius: 10px;
  }
  .investment {
    margin: 5% auto auto auto;
    padding-top: 4%;
    padding-bottom: 2%;
    background-color: rgba(216, 209, 230, 1);
    border-radius: 10px;
  }
  .investment-text {
    font-size: 13px;
    color: #6c6c6c;
  }
  .feature-container h5 {
    margin-top: 2%;
  }
  .feature-container p {
    margin-bottom: 2%;
  }
  .feature-container img {
    max-width: 300px;
    max-height: 300px;
    display: block;
    margin: auto;
  }
  .feature-container {
    background-color: rgba(248, 246, 253, 1);
    padding: 5% 5% 5% 5%;
  }
  .partnership-container {
    padding: 5%;
    background-color: rgba(216, 209, 230, 1);
    justify-content: center;
  }
  .features-text {
    color: #ffffff;
    padding-left: 0px;
  }
  .circular-background p {
    color: rgba(216, 209, 230, 1);
    margin-bottom: 2%;
  }
  .features-column {
    margin: 25% 5% auto 5%;
  }
  .feature-images {
    width: 10%;
    /* max-width: 120px;
    max-height: 120px; */
    margin: auto 0% auto auto;
  }
  .fortune-background h2 {
    color: white;
    padding-left: 10%;
    padding-right: 10%;
  }
  .interest-headers {
    margin-top: 15%;
  }
  .fortune-interest {
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
  }
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
  .fortune-heading {
    width: 60%;
    max-width: 500px;
    max-height: 300px;
    display: block;
    margin: 10% auto auto auto;
  }
  .fortune-background {
    background-image: url("/assets/images/fortune_background.svg");
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
  }
  .circular-background {
    margin-top: 50px;
    margin-bottom: 20px;
    background-image: url("/assets/images/circular_background.svg");
    background-size: 100% auto;
    background-repeat: no-repeat;
    width: 100%;
    justify-content: center;
    font-family: "Poppins", sans-serif;
  }

  @media (max-width: 450px) {
    .feature-images {
      width: 12%;
    }
    .slider {
      padding-right: 35px;
    }
    .investment-text {
      font-size: 10px;
    }
  }
</style>
