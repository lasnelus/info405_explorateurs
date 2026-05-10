/**
 * Formate une date selon le format DD/MM/YYYY
 * @param dateString une date valide sous forme de chaine de charactère
 * @returns une date formatée plus compréhensible de l'humain.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
