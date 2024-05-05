import { mapToArray } from "../helpers";


class PeriodArray extends Array  {


  
  getCurrent () {
    const now = new Date()
    const filtered = this.filter(
      (a) => { 
        return a.startDate < now && a.endDate > now
      })
    return filtered[0]
  }

  static buildFromMap(object, {childrenInitializer}) {

    if (!object) return null

    const periodArray = new PeriodArray()
    Object.keys(object).forEach((key) => {
      let period = object[key]
      period.id = key
      childrenInitializer && (period = childrenInitializer(period))
      periodArray.push(period)
    })
    periodArray.sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
    return periodArray
  }
}

export default PeriodArray