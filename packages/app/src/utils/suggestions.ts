
const getHiddenSuggestions = () => {
  const hiddenSuggestions = localStorage.getItem('hiddenSuggestions')
  return hiddenSuggestions ? JSON.parse(hiddenSuggestions) : {}
}

// const hideSuggestion = (suggestionId) => {
//   const hiddenSug = getHiddenSuggestions()
//   hiddenSug[suggestionId] = true
//   setHiddenSuggestions({ ...hiddenSug })
//   localStorage.setItem('hiddenSuggestions', JSON.stringify(hiddenSug))
// }

// const hideSuggestion = (suggestionId) => {
//   const hiddenSug = getHiddenSuggestions()
//   hiddenSug[suggestionId] = true
//   localStorage.setItem('hiddenSuggestions', JSON.stringify(hiddenSug))
//   const hiddenSuggestions = localStorage.getItem('hiddenSuggestions')
//   return hiddenSug
// }

export {
  getHiddenSuggestions
}
