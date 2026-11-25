export function getMotivationMessage(progress: number): string {
  if (progress >= 100) return 'Cel osiągnięty! 🎉'
  if (progress >= 80) return 'Już prawie! 🔥'
  if (progress >= 50) return 'Jesteś już za połową!'
  if (progress >= 20) return 'Dobry początek! 🚀'
  return 'Dopiero zaczynasz. Każda złotówka ma znaczenie.'
}
