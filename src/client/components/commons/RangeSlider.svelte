<script>
  export let data = [];
  export let defaultIndex = 0;
  export let selected = data[defaultIndex];
  export let onChange = null;
</script>

<div class="main">
  <input
    title={selected}
    type="range"
    min="0"
    max={data.length - 1}
    step="1"
    bind:value={defaultIndex}
    on:input={(e) => {
      selected = data[e.target.value];
    }}
    on:change={(e) => {
      onChange();
    }}
    class="slider"
  />
  <div
    class="selector"
    style="left: {(defaultIndex * 100) / data.length + '%'}"
  >
    <div class="selectBtn" />
    <div class="selectValue">{selected}</div>
  </div>
  <div
    class="progressBar"
    style="width:  {(defaultIndex * 100) / data.length + '%'}"
  />
</div>

<style>
  .main {
    width: calc(100%-50px);
    margin: 50px auto;
    position: relative;
  }
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 7px;
    border-radius: 3px;
    background-color: #d8d1e6;
  }

  /* Design slider button */
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: pointer;
    position: relative;
    z-index: 3;
    background-color: #350793;
    height: 25px;
    width: 25px;
    border-radius: 50%;
  }

  .selector {
    height: 85px;
    width: 48px;
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  /* .selectBtn {
    height: 28px;
    width: 28px;
    background-color: #350793;
    background-size: contain;
    background-position: center;
    border-radius: 50%;
    position: absolute;
    bottom: 15px;
    left: 0px;
    cursor: pointer;
  } */
  .selectValue {
    width: 70px;
    height: 35px;
    position: absolute;
    top: 0;
    background: #350793;
    border-radius: 4px;
    text-align: center;
    line-height: 35px;
    font-size: 11px;
    color: #ffffff;
    font-weight: 500;
  }
  .selectValue::after {
    content: "";
    border-top: 17px solid #350793;
    /* border-left: 35px solid #ffffff;
    border-right: 35px solid #ffffff; */
    position: absolute;
    bottom: -14px;
    left: 0;
  }
  .progressBar {
    width: 100%;
    height: 7px;
    background: #350793;
    border-radius: 3px;
    position: absolute;
    bottom: 6px;
    left: 0;
  }
</style>
