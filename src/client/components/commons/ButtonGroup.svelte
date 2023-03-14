<script>
  export let data = [
    { label: "Daily", value: 365 },
    { label: "Weekly", value: 52 },
    { label: "Monthly", value: 12 },
    { label: "Yearly", value: 1 },
    { label: "One-time", value: -1 },
  ];
  export let selected = 0;
  export let onChange = null;
</script>

<div class="radio-group">
  {#each data as item}
    <button
      class={selected === item.value
        ? "btn btn-selected m-2"
        : "btn btn-secondary m-2"}
      on:click={() => {
        selected = item.value;
        onChange();
      }}
    >
      {item.label}
    </button>
  {/each}
</div>

<style>
  .btn-secondary {
    color: #000;
    font-size: 12px;
    background-color: #f3f1f8;
    border-color: #f3f1f8;
  }
  .btn-selected {
    color: #000;
    background-color: #d8d1e6;
    border-color: #d8d1e6;
  }
  .btn-selected:hover {
    background-color: #d8d1e6;
    border-color: #d8d1e6;
  }
  .radio-group {
    display: flex;
    flex-wrap: wrap;
  }

  @media (max-width: 450px) {
    .btn-secondary {
      font-size: 13px;
    }
    .btn-selected {
      font-size: 15px;
    }
  }
</style>
