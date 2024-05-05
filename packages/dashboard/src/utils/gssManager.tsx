import { GoogleSpreadsheet } from "google-spreadsheet"

export default async (url) => {
  const gsheetInfo = gsheetInfoFromUrl(url)
  const SPREADSHEET_ID = gsheetInfo.gssId
  const SHEET_ID = gsheetInfo.sheetId
  const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL
  const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)

  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    })
    await doc.loadInfo()
    const gssDoc = doc.sheetsById[SHEET_ID]

    return { doc, gssDoc }
  } catch (e) {
    console.error("Error: ", e)
  }
}

const gsheetInfoFromUrl = (url) => {
  const matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(url)
  return {
    gssId: matches[1],
    sheetId: matches[3],
  }
}

export const addColibriRougeExample = async (gssDoc) => {
  await gssDoc.addRow({ id: "Colibri Rouge", text: "colibri.rouge@abc.xyz" })
}

export const printGssDoc = async (gssDoc) => {
  const rows = await gssDoc.getRows()
}

export const importFromGssDoc = async (gssDoc, questionSetIdToImport) => {
  const rows = await gssDoc.getRows()
  const res = []
  rows.forEach((row) => {
    if (row.questionSetId === questionSetIdToImport) {
      res.push(row)
    }
  })
  return res.length > 0 ? res : false
}

export const exportToGssDoc = async (gssDoc, dataToSave, headerValues) => {
  await gssDoc.clear()
  await gssDoc.insertDimension("COLUMNS", { startIndex: 0, endIndex: headerValues.length })
  await gssDoc.setHeaderRow(headerValues)
  await gssDoc.addRows(dataToSave)
}
