<template>
  <div class="grid justify-center">

    <div class="
      bg-primary-background
      rounded-2xl
      input
      grid
      justify-center
      p-[40px]
      px-[30px]
      w-auto
      my-[50px]
      mx-[44px]
    " id="signUpBox" style="
      box-shadow: 4px 4px 15px -8px var(--color-primary);
    ">
      <input type="text" id="UserName" name="UserName" placeholder="David" class="color-text"/>

      <input type="text" id="EMail" name="EMail" placeholder="david@cmi-info.fr" class="color-text"/>

      <input type="password" id="Password" name="Password" placeholder="S0ph!sticat€dP@ssw0rd" class="color-text"/>

      <input type="password" id="PasswordConfirm" name="PasswordConfirm" placeholder="S0ph!sticat€dP@ssw0rd" class="color-text"/>
    </div>

    <div id="switchToSignInBox">

    </div>
  </div>

</template>

<script setup lang="ts">
</script>

<style scoped>
input {
  width: calc(inherit - 60px);
  border-style: var(--tw-border-style);
  border-width: 0px;
  border-radius: var(--radius-lg);
  padding-block: calc(var(--spacing) * 3);
  padding-inline: calc(var(--spacing) * 5);
  --tw-outline-style: none;
  outline-style: none;
  background-color: rgba( from var(--color-primary-background) calc(r + 25)  calc(g + 25) calc(b + 25) / .75);
  margin: 10px 0;

  transition: var(--default-transition-duration);
}

input:hover, input:active {
  background-color: rgba( from var(--color-primary) r g b / .15);
  transition: var(--default-transition-duration);
}

</style>
