import { objectSubset } from "@maracuja/shared/helpers"

const buildClubsFromImport = ({ importedClubs, departments, regions, tribes }) => {
  const buildClub = ({ zipCode, name, memberCount, city, tribe }) => {
    const data: any = {}
    data.name = name.trim()
    data.initialName = data.name
    data.zipCode = parseZipCode(zipCode)

    const geo = getGeoFromZipCode(data.zipCode, { regions, departments })
    data.department = geo.department
    data.departmentId = data.department.id
    data.region = geo.region
    data.regionId = data.region.id

    if (memberCount) {
      data.memberCount = memberCount
    }
    if (city) {
      data.city = city.trim()
    }

    data.tribe = { name: tribe.name, id: tribe.id }
    data.tribeId = data.tribe.id
    data.tribeIds = [data.tribeId]
    return data
  }

  /// /EXECUTION
  const data = []
  const missingTribes = []
  importedClubs.forEach((club) => {
    const tribe = tribes[tribes.findIndex((tribe) => tribe.id === club.tribeId)]
    if (!tribe) {
      if (!missingTribes.includes(club.tribeId)) {
        missingTribes.push(club.tribeId)
      }
    } else if (!club.name) {
      alert("zipcode ou nom manquant " + club)
      throw new Error("zipcode manquant")
    } else {
      club.tribe = tribe
      const builtClub = buildClub(club)
      data.push(builtClub)
    }
  })

  // errors
  if (missingTribes.length) {
    alert(
      `Des tribus sont manquantes en base : \n - ${missingTribes.join("\n - ")}. \n Merci de les ajouter puis reessayez`
    )
  } else {
    return data
  }
}

const parseOldZipCode = (zipCode) => {
  if (!zipCode) {
    return null
  }

  zipCode = zipCode.toString()
  if (zipCode.length === 4) {
    zipCode = "0" + zipCode
  }
  return zipCode
}

const parseZipCode = (zipCode) => {
  zipCode = zipCode.toString()
  if (zipCode.length === 4 || zipCode.length === 1) {
    zipCode = "0" + zipCode
  }
  if (zipCode.length === 2) {
    zipCode = zipCode + "000"
  }

  return zipCode
}

const getGeoFromZipCode = (zipCode, { regions, departments }) => {
  if (!zipCode || !regions) return null

  const A2 = [
    "20146",
    "20537",
    "20166",
    "20090",
    "20000",
    "20239",
    "20128",
    "20112",
    "20151",
    "20167",
    "20110",
    "20160",
    "20140",
    "20151",
    "20116",
    "20190",
    "20121",
    "20160",
    "20119",
    "20129",
    "20110",
    "20100",
    "20136",
    "20169",
    "20111",
    "20142",
    "20151",
    "20170",
    "20133",
    "20190",
    "20130",
    "20164",
    "20111",
    "20140",
    "20117",
    "20134",
    "20160",
    "20123",
    "20135",
    "20168",
    "20138",
    "20148",
    "20126",
    "20167",
    "20117",
    "20126",
    "20114",
    "20100",
    "20190",
    "20143",
    "20157",
    "3 20100",
    "20128",
    "20160",
    "20128",
    "20153",
    "20137",
    "20160",
    "20170",
    "20139",
    "20165",
    "20141",
    "20112",
    "20140",
    "20171",
    "20160",
    "20117",
    "20140",
    "20113",
    "20112",
    "20125",
    "20147",
    "20150",
    "20134",
    "20147",
    "20121",
  ]
  const B2 = [
    "20144",
    "20243",
    "20118",
    "20270",
    "20244",
    "20212",
    "20224",
    "20270",
    "20220",
    "20251",
    "20212",
    "20272",
    "20270",
    "20220",
    "20276",
    "20225",
    "20253",
    "20228",
    "20200",
    "20226",
    "20252",
    "20620",
    "20235",
    "20290",
    "20222",
    "20212",
    "20228",
    "20224",
    "20214",
    "20260",
    "20244",
    "20229",
    "20270",
    "20290",
    "20252",
    "20230",
    "20217",
    "20235",
    "20229",
    "20244",
    "20237",
    "20215",
    "20224",
    "20250",
    "20270",
    "20213",
    "20212",
    "20235",
    "20218",
    "20236",
    "20225",
    "20238",
    "20221",
    "20230",
    "20240",
    "20256",
    "20224",
    "20250",
    "20226",
    "20237",
    "20290",
    "20212",
    "20244",
    "20275",
    "20253",
    "20212",
    "20234",
    "20225",
    "20237",
    "20212",
    "20600",
    "20245",
    "20218",
    "20240",
    "20227",
  ]

  let departmentCode = zipCode.toString().substring(0, 2)
  if (A2.includes(zipCode)) {
    departmentCode = "2A"
  } else if (B2.includes(zipCode)) {
    departmentCode = "2B"
  } else if (departmentCode === "97" || departmentCode === "98") {
    departmentCode = zipCode.substring(0, 3)
  }

  const matchingDept = departments.find((dep) => dep.code === departmentCode + "")
  const matchingRegion = matchingDept && regions.find((reg) => reg.code === matchingDept.region_code)
  if (!matchingDept || !matchingRegion) return null
  const geo = {
    department: objectSubset(matchingDept, ["id", "code", "name"]),
    region: objectSubset(matchingRegion, ["id", "code", "name"]),
  }
  return geo
}

export { buildClubsFromImport, getGeoFromZipCode }
