// -----------
// TODAY CHILD

type Slot = {
  id: string
  childId: string
  periodeId: string
  day: string
  isChildPresent: boolean
  createdAt: string
  updatedAt: string
}

type Enfant = {
  id: string
  firstName: string
  lastName: string
  foodConstraint: string
  present: boolean
  slots: Slot[]
}

// --------------
// TOMORROW CHILD

interface slots {
  id: string
  date: string
  id_repas: string
}

interface Child {
  id: string
  firstName: string
  lastName: string
  foodConstraint: string
  slots: slots[]
}

type Repas = {
  API_NAME: string
  label: string
  nb_unit: number
}

/**
 * Prends une liste d'enfants et renvoie la liste des repas en fonction de leurs restrictions alimentaires
 */
export function calcFoodList(childList: Array<Child> | Array<Enfant>): Repas[] {
  const foodList: Repas[] = getBlankFoodList()

  childList.forEach((child) => {
    const matchingFood = foodList.find((food) => food.API_NAME === child.foodConstraint)
    if (matchingFood) {
      matchingFood.nb_unit++
    } else {
      console.warn(
        `calcFoodList: Impossible de trouver le type de régime correspondant a '${child.foodConstraint}' dans la liste : `,
        foodList,
      )
    }
  })
  return filterFoodList(foodList)
}

/**
 * Filters a food list to remowe empty constraints from it
 */
function filterFoodList(foodList: Repas[]): Repas[] {
  return foodList.filter((repas: Repas) => repas.nb_unit > 0)
}

/**
 * Returns a blank food list
 */
function getBlankFoodList(): Repas[] {
  return [
    { API_NAME: 'NONE', label: 'Normal', nb_unit: 0 }, // NONE
    { API_NAME: 'NO_PORK', label: 'Sans Porc', nb_unit: 0 }, // NO_PORK
    { API_NAME: 'NO_MEAT', label: 'Sans Viande (végétarien)', nb_unit: 0 }, // NO_MEAT
    { API_NAME: 'ALLERGY_OR_INTOLERANCE', label: 'Allergie ou Intolerance', nb_unit: 0 }, // ALLERGY_OR_INTOLERANCE
  ]
}

/**
 * Prends une liste d'enfants présents ce jour ci et renvoie la liste des repas en fonction de leurs restrictions alimentaires ET de leur présence ou non ce jour ci.
 */
export function calcAttendingChildFoodList(childList: Array<Enfant>): Repas[] {
  const foodList = getBlankFoodList()

  childList.forEach((child) => {
    const matchingFood = foodList.find((food) => food.API_NAME === child.foodConstraint)

    if (matchingFood && child.present) {
      matchingFood.nb_unit++
    } else {
      if (child.present) {
        console.warn(
          `calcFoodList: Impossible de trouver le type de régime correspondant a '${child.foodConstraint}' dans la liste : `,
          foodList,
        )
      }
    }
  })
  return filterFoodList(foodList)
}
