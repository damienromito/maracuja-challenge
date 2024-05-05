const audienceFiltersToAlgoliaFacets = (filters) => {
  const filterArray = []
  Object.keys(filters).forEach(key => {
    const currentFilterArray = []
    const challengeFilter = filters[key]
    challengeFilter.forEach((filterValue, index) => {
      currentFilterArray.push(`${key}.id: ${filterValue.id}`)
    })
    filterArray.push(currentFilterArray)
  })
  return filterArray
}

export {
  audienceFiltersToAlgoliaFacets
}
