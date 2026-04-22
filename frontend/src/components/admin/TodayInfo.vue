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
              <thead class="border-b border-default">
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
                          PRESENT ?
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
                      <td id="present">
                        Oui
                      </td>
                      <td>
                          <a href="#">Edit</a>
                      </td>
                  </tr>
                  <tr>
                      <th scope="row">
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
                      <td id="present">
                        Oui
                      </td>
                      <td>
                          <a href="#">Edit</a>
                      </td>
                  </tr>
                  <tr>
                      <th scope="row">
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
                      <td style="padding: 0;">
                        <label class="flex justify-center items-center cursor-pointer w-1/2 ">

                          <input
                            type="checkbox"
                            v-model="checked"
                            class="sr-only peer"
                          />

                          <div class="w-10 h-10
                                flex items-center justify-center
                                bg-(--header-color)
                                rounded border border-text
                                peer-checked:bg-success">

                            <!-- FIXED SVG -->
                            <svg
                              class="w-7 h-7 text-white opacity-0 peer-checked:opacity-100 transition"
                              fill="none"
                              stroke="red"
                              stroke-width="3"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>

                          </div>

                        </label>
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

