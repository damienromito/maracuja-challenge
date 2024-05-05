const functions = require("firebase-functions")
// const admin = require('firebase-admin')
const algoliasearch = require("algoliasearch")
const { getAction, objectFromChangeProps } = require("../../utils")
const { debug, info, error } = require("firebase-functions/lib/logger")

const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key
const ALGOLIA_INDEX_NAME_CLUBS = functions.config().algolia.clubs_key
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

exports = module.exports = functions
  .region("europe-west1")
  .firestore.document("clubs/{clubId}")
  .onWrite(async (change, context) => {
    const clubId = context.params.clubId
    const [action, oldDocument, newDocument] = getAction(change)

    if (action === "create" || action === "update") {
      const club = objectFromChangeProps({
        change,
        props: [
          "tribeTypeId",
          "memberCount",
          "originId",
          "regionId",
          "tribeId",
          "tribeType",

          "name",
          "nameVariations",
          "logo",
          "memberCount",
          "zipCode",
          "city",
          "organisationsId",
          // CLUB PROPERTIES
          "sportFederation",
          "department",
          "crosCollectivity",
          "lrrBassin",
          "ffeClubNumber",
          "schoolAcademy",
          "schoolType",
          "region",
          "tribe",
        ],
      })
      club.id = clubId
      club.objectID = clubId // ID for Algolia

      debug("ClubsOnWrite ", ALGOLIA_INDEX_NAME_CLUBS, club)
      try {
        const index = client.initIndex(ALGOLIA_INDEX_NAME_CLUBS)
        await index.partialUpdateObject(club, { createIfNotExists: true })
        debug(action + " Team in algolia ", club)
      } catch (err) {
        error(err, `Error update club in algolia (${action}) `, club)
      }
      return true
    } else if (action === "delete") {
      try {
        info("delete club in algolia" + ALGOLIA_INDEX_NAME_CLUBS + " " + clubId)
        const index = client.initIndex(ALGOLIA_INDEX_NAME_CLUBS)
        await index.deleteObject(clubId)
      } catch (err) {
        error("Error deleting club in algolia", err)
      }
      return true
    } else {
      return true
    }
  })
