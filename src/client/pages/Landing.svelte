<script>
  import { Card } from "sveltestrap";
  import Button from "sveltestrap/src/Button.svelte";
</script>

<div class="landing-page-container">
  <Card style="border-radius:30px; margin-top:3%; margin-bottom:5%;">
    <div class="fortune-background">
      <div class="col circular-background">
        <img
          class="fortune-heading"
          src="/assets/images/fortune_heading.svg"
          alt="heading"
        />

        <div class="col interest-headers">
          <h2 class="alignleft" style="float:left;">Earn up to</h2>
          <img
            class="fortune-interest"
            src="/assets/images/$120k.svg"
            alt="11.95%"
          />
          <h2 class="alignright" style="float:right;">interest p.a</h2>
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
              <h6>Save small, earn big</h6>
              <p>
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
              <h6>Earn interest every day</h6>
              <p>Make every day count with daily interest on your savings.</p>
            </div>
          </div>
          <div class="row features">
            <img
              class="feature-images"
              src="/assets/images/tab_move.svg"
              alt="wallet"
            />
            <div class="col features-text">
              <h6>Withdraw anytime</h6>
              <p>
                Take control of your finances, withdraw your money anytime,
                anywhere.
              </p>
            </div>
          </div>
        </div>
        <Button
          style="border-radius:35px; width:80%; margin-left: auto; margin-right:auto; display:block; background-color: transparent; border: 2px solid white;font-size: 2.5vw;"
          >Apply for early access</Button
        >
      </div>
    </div>
    <div class="col partnership-container">
      <h3 style="font-size:4vw;">
        In partnership with India’s largest P2P lending platform
      </h3>
      <img
        src="/assets/images/lenden_logo.svg"
        alt="LenDen"
        style="max-width:300px; height:auto; width:50%; margin:auto; display:block;"
      />
      <p style="font-size:3vw;">
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
            style="max-width:220px; max-height:200px; width:100%; margin:auto; display:block;padding-top:1%"
          />
        </div>
        <div class="col">
          <img
            src="/assets/images/Trusted_users.svg"
            alt="Trusted by 80L"
            style="max-width:210px; max-height:200px; width:100%; margin:auto; display:block;padding-top:5%"
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
        <img
          src="/assets/images/calendar.svg"
          alt="Low saving"
          style="width:80%; max-width:500px;"
        />
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
    <div class="earnings-calculator" style="height:500px; padding: 5%;">
      <h4 style="font-size:4vw; font-weight:600;">Earnings Calculator</h4>
    </div>
    <div
      class="market-comparision-container"
      style="padding: 5%; background-color:rgba(243, 241, 248, 1);"
    >
      <h4 style="font-size:4vw; font-weight:600;">Earn like the ultra-rich</h4>
      <p style="font-size:3vw;">
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
      <h4 style="font-size:4vw; font-weight:600;">Coming soon</h4>
      <p style="font-size:3vw;margin-bottom:10%;">
        The future is now with Spense Fortune. Don't miss out on being one of
        the first to enjoy its groundbreaking benefits.
      </p>
      <Button
        style="width:90%; border-radius:30px; background-color:rgba(53, 7, 147, 1); margin:auto;display:block; height: 40%;font-size: 2.5vw;"
        >Apply for early access</Button
      >
    </div>
  </Card>
</div>

<style>
  .coming-soon {
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  .comparision-row {
    margin: 5% auto 0% auto;
    padding-top: 6%;
    background-color: rgba(216, 209, 230, 1);
    border-radius: 20px;
  }
  .market-comparision-container p {
    font-size: 3vw;
  }
  .feature-container h5 {
    font-size: 4vw;
    margin-top: 2%;
  }
  .feature-container p {
    font-size: 3vw;
    margin-bottom: 2%;
  }
  .feature-container img {
    width: 50%;
    max-width: 300px;
    max-height: 300px;
    display: block;
    margin: auto;
  }
  .feature-container {
    background-color: rgba(248, 246, 253, 1);
    padding: 10% 5% 5% 5%;
  }
  .partnership-container {
    padding: 5%;
    background-color: rgba(216, 209, 230, 1);
    justify-content: center;
  }
  .features-text {
    padding-left: 0px;
  }
  .circular-background h6 {
    margin-top: 2%;
    font-size: 4vw;
    color: rgba(216, 209, 230, 1);
  }
  .circular-background p {
    font-size: 3vw;
    color: rgba(216, 209, 230, 1);
    margin-bottom: 2%;
  }
  .features-column {
    margin: 25% 5% auto 5%;
  }
  .feature-images {
    height: 15%;
    width: 15%;
    max-width: 120px;
    max-height: 120px;
    margin: auto 0% auto auto;
  }
  .fortune-background h2 {
    color: white;
    padding-left: 10%;
    padding-right: 10%;
    font-size: 5vw;
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
</style>
