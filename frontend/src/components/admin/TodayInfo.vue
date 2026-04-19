<template>
  <div class="m-3 mr-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">
      Aujourd'hui
    </h1>

    <!-- ENFANTS PRESENTS -->
    <div>

      <h2 class="text-xl font-bold mb-1 text-text/85">
        Enfants présents
      </h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-body">
              <thead class="bg-primary-background border-b border-default">
                  <tr>
                      <th scope="col">
                          ID_ENFANT
                      </th>
                      <th scope="col">
                          NOM
                      </th>
                      <th scope="col">
                          PRENOM
                      </th>
                      <th scope="col">
                          REGIME SPECIAL ?
                      </th>
                      <th scope="col">
                          ACTION
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <th scope="row">
                          cmmnyxpbl0000u8uiq58b0xkb
                      </th>
                      <td>
                          VERSTAPEN
                      </td>
                      <td>
                          Max
                      </td>
                      <td>
                          Non
                      </td>
                      <td>
                          <a href="#" class="font-medium text-fg-brand underline hover:decoration-2">Edit</a>
                      </td>
                  </tr>
                  <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                      <th scope="row" class="">
                          cmmnyxpbl0000u8uiq58b0xkb
                      </th>
                      <td>
                          HAMILTON
                      </td>
                      <td>
                          Lewis
                      </td>
                      <td>
                          Non
                      </td>
                      <td>
                          <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                      </td>
                  </tr>
                  <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                      <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                          cmmnyxpbl0000u8uiq58b0xkb
                      </th>
                      <td>
                          LECLERC
                      </td>
                      <td>
                          Charles
                      </td>
                      <td>
                          Non
                      </td>
                      <td>
                          <a href="#" class="font-medium text-fg-brand hover:underline">Edit</a>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
    </div>





    <p>

      Enfants Présents <br>
      Tableau : ID_ENFANT | nom | prenom | regime_special | [si regime_special]->[type_regime] | [si owner]->[accès fiche enfant]

    </p>
    <p>

      tab recap repas : ID_REPAS | type | nb_unit | est_regime_special | [si regime_special]->[type_regime]

    </p>
  </div>
</template>

<style scoped>

table a {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  transition: .3s;
}

table a:hover {
  font-weight: bolder;
  transition: .3s;
}

thead tr {
  background-color: color-mix(in oklab, var(--color-primary-background) / 75%, transparent) !important;
}

th {
  padding-inline: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
  padding-block: calc(var(--spacing) * 3) /* 0.75rem = 12px */;
  --tw-font-weight: var(--font-weight-medium) /* 500 */;
  font-weight: var(--font-weight-medium) /* 500 */;
  white-space: nowrap;
}

th[scope="col"] {
  color: var(--color-text);
}

th[scope="row"] {
  color: color-mix(in oklab, var(--color-text) /* var(--color-text) */ 75%, transparent);
}

td {
  padding-inline: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
  padding-block: calc(var(--spacing) * 4) /* 1rem = 16px */;
}

tr {
  border-bottom-style: var(--tw-border-style);
  border-bottom-width: 1px;
}

tr:nth-of-type(even) {
  background-color: color-mix(in oklab, var(--color-primary) /* var(--color-text) */ 75%, transparent);
}

tr:nth-of-type(odd) {
  background-color: color-mix(in oklab, var(--color-primary-background) /* var(--color-text) */ 50%, transparent);
}

</style>
