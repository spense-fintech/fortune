<script>
  import RangeSlider from "../components/commons/RangeSlider.svelte";
  import ButtonGroup from "../components/commons/ButtonGroup.svelte";
  import Button from "../components/commons/Button.svelte";
  import { Card } from "sveltestrap";
  import { onMount } from "svelte";

  let amountIndex = 4;
  let durationIndex = 3;
  let interestIndex = 20;
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

  let interestArray = [
    2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5,
    5.75, 6, 6.25, 6.5, 6.75, 7, 7.25, 7.5, 7.75, 8, 8.25, 8.5, 8.75, 9, 9.25,
    9.5, 9.75, 10, 10.25, 10.5, 10.75, 11, 11.25, 11.5, 11.75, 12, 12.25, 12.5,
    12.75, 13, 13.25, 13.5, 13.75, 14, 14.25, 14.5, 14.75, 15, 15.25, 15.5,
    15.75, 16, 16.25, 16.5, 16.75, 17, 17.25, 17.5, 17.75, 18, 18.25, 18.5,
    18.75, 19, 19.25, 19.5, 19.75, 20,
  ];
  let interestArrayText = [
    "2%",
    "2.25%",
    "2.5%",
    "2.75%",
    "3%",
    "3.25%",
    "3.5%",
    "3.75%",
    "4%",
    "4.25%",
    "4.5%",
    "4.75%",
    "5%",
    "5.25%",
    "5.5%",
    "5.75%",
    "6%",
    "6.25%",
    "6.5%",
    "6.75%",
    "7%",
    "7.25%",
    "7.5%",
    "7.75%",
    "8%",
    "8.25%",
    "8.5%",
    "8.75%",
    "9%",
    "9.25%",
    "9.5%",
    "9.75%",
    "10%",
    "10.25%",
    "10.5%",
    "10.75%",
    "11%",
    "11.25%",
    "11.5%",
    "11.75%",
    "12%",
    "12.25%",
    "12.5%",
    "12.75%",
    "13%",
    "13.25%",
    "13.5%",
    "13.75%",
    "14%",
    "14.25%",
    "14.5%",
    "14.75%",
    "15%",
    "15.25%",
    "15.5%",
    "15.75%",
    "16%",
    "16.25%",
    "16.5%",
    "16.75%",
    "17%",
    "17.25%",
    "17.5%",
    "17.75%",
    "18%",
    "18.25%",
    "18.5%",
    "18.75%",
    "19%",
    "19.25%",
    "19.5%",
    "19.75%",
    "20",
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
      maximumFractionDigits: 2,
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

<div class="d-flex flex-column align-items-center justify-content-center">
  <h2 class="fw-semibold">INVEST NOW</h2>
  <div style="max-width:100%;width:480px;">
    <div class="mt-4">
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
      <div>
        <span class="fw-semibold">Rate of Interest</span>
        <RangeSlider
          data={interestArrayText}
          bind:defaultIndex={interestIndex}
          onChange={valueChanged}
        />
      </div>
    </div>
    <div class="investment row mb-3">
      <span class="investment-text">Get</span>
      <span class="maturity_amt fw-bold fs-1">{result.maturityAmount}</span>
      <div class="d-flex gap-4">
        <span class="investment-text">Invested: {result.investedAmount}</span>
        <span class="investment-text">Interest: {result.interest}</span>
      </div>
    </div>
    <Button title="Invest Now" />
  </div>
</div>

<style>
  .investment {
    margin: 5% auto auto auto;
    padding-top: 4%;
    padding-bottom: 2%;
    background-color: rgba(216, 209, 230, 1);
    border-radius: 10px;
    height: 18%;
  }
  .investment-text {
    color: #6c6c6c;
  }

  @media (max-width: 450px) {
    .test_container {
      padding-top: 10%;
    }
    .slider {
      padding-right: 35px;
    }
  }
</style>
