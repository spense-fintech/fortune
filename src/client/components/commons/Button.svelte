<!--Button-->
<script>
  export let onclick;
  export let title;
  export let id = "";
  export let name = "";
  export let disabled = false;
</script>

<button {id} {title} {name} class="button" on:click={onclick} {disabled}>
  {title} <img src="" alt />
</button>

<style>
  .button {
    font-family: "Poppins";
    font-style: normal;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    color: #fff;
    background-color: #350793;
    border: none;
    line-height: 16px;
    text-align: center;
    border-radius: 1.5rem;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 58px;
    padding-right: 58px;
    width: 100%;
    margin-bottom: 10px;
  }

  .button:hover {
    background-color: #350793;
    box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.4);
    color: #fff;
    transform: translateY(-2px);
  }
  @media (max-width: 450px) {
    .button {
      font-family: "Poppins";
      font-style: normal;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      font-style: normal;
      color: #fff;
      background-color: #350793;
      border: none;
      line-height: 15px;
      text-align: center;
      border-radius: 1.5rem;
      box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease 0s;
      cursor: pointer;
      outline: none;
      padding-top: 16px;
      padding-bottom: 16px;
      padding-left: 58px;
      padding-right: 58px;
      width: 97%;
    }
  }
</style>
