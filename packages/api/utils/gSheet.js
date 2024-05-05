const { GoogleSpreadsheet } = require('google-spreadsheet');

const GOOGLE_CLIENT_EMAIL="google-sheets-maracuja@maracuja-english-challenge.iam.gserviceaccount.com"
const GOOGLE_SERVICE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVX1U2XbVlIX6d\nS3ZbJvYuniJ8xOm7n8Gzn1Lnh7LBnrBYXPbzlsFkW3CCGAqS90iD8LTDfV4i7psr\n/IjYfsV6/FsE4ZPaAtjPzbvpVKvX0zaEpBoHm5EmQ7UgKEFOG3djU2ph8iIu+4Eq\n/0rrYI35SH9tuknGW8MnDXFNk+y81oEKChr0Ua8SBQEA2UTjJkKWYfWZGIz1O+oI\n8d6G0NXDTl+Rtwh0odBz/0rBgYe9sbqUPAO6+3wgO2xq2/hx+XhS3NnPfhdChMal\niXxHUADRbIjcwaBWJWWPq+2Q+IZq6PW7v1RJbwEmz+e1d/+czBdCAK8+4IpagNhQ\nIiNPnLdzAgMBAAECggEALqor27kA2/5IT6RaXTMXMjjZeAokyCj3Vw5oNkTCPoAz\nNxAV3k5BO26YG4ugfGXikSCKmBqKBP/EJgmT8C1BiVU5nsaq7EolGsV27F/dOVVz\nHe052CIYy5KRQVgseCWfpbRvlr465aWRqVKuEu5J/pPxcpEEY4JcGuVgu0O3ydCF\noIVCZ2NzJDEZVYQqYR+zNC/r/aA5wjaz/Sep2MDouFqXLXdKdvhBS0GXs6+NLqy6\nca6nQcQTY72XJNaD4voXvpr91P7GciI27lThaLTb7FIi5wogLaQyRO6Jtp9b3KQc\nG2O2bfDIuONXGHVBwjGvmIaIbymVrhfsLfuOMEG6gQKBgQDwjlHobt+lWBcPH09n\nCAwrLWOR2xwYkj2P/tAiq+4GskVCKcABs4Q6n8nHgu4MvH+5lv3zD6Xk26V/uYw2\n6Tpr6wymithmmT7Zy38Nv/40bMps4esW7PWdatKHWPfY40PcbMbD77gy2cwHFXUo\nXdeqORDKEVkhzX0+XFiYh3JqswKBgQDjEjw1XhCY8PRdiRCOsPd4oQDQxeUIOzD3\nQOrUVbg4VXkTQpd0PKV751cOYC+NHI9OlmFAi/uIluy2cQS6M9FzPGqCrYiIgve2\nFJwlPCNnB4X+BiS6UXFeWgZFrGIC0MkliMWgvC1j6NCChQjtcF4vFvAOg2vsXrCm\ni8CbzoHgQQKBgQDddjkEIqb1Au9ftbSVJzyEt6m2SyFHocLZgX6+nMhrE85dRjCF\noG54xkiuy+Q6h4OTKeYr0lkpI+nud7UVjIyDdAbWgHcPpb/OJOGYmAwA2bNWoHqd\nRZQt0310q7ypyTjdgqtPEa/j6M1ELEYK3rJA/X5ueaA0VYkbU0shSXlVrwKBgQDR\nOkU2G3WJp0RTR291O4Tbpubcd+xAuGG3Ah8fBdkYN1G3uH1bgmItGA30VhaanL1D\neXclBZcA1ahJtzvW4tZUq0+tF38d4iejo7v45z/ruFfzp++Bqneeq67p1hv9Yipl\npnALWjksvSIbkb+XIRn3o9gQV3JDO0DkRRN1vUOYwQKBgE5xoH/vEl9UpETmKh1f\nAcW9kEw7iZFgk7vP5pCNy4hSvtQQ9m4/QOMeaoZvhln5keY+maHdlx5VMwQOCdkS\niMW1gkZ2/wB5kWKyvJe4lncVdqJq1XWWO8QzppR/9z1ztrtY/YXWlfb5Pcdt62q5\nlInTAER+z3WZOxTr01J9L9Zu\n-----END PRIVATE KEY-----\n"


const syncSheetFromUrl = (url) => {
  const result = url.match(/\/d\/(.*)\/.*gid=(.*)/)
  return syncSheet({
    spreadSheetId : result[1],
    sheetId : result[2],
  })
}



const syncSheet = async ({spreadSheetId, sheetId}) => {
  const CLIENT_EMAIL = GOOGLE_CLIENT_EMAIL
  const PRIVATE_KEY = GOOGLE_SERVICE_PRIVATE_KEY
  const doc = new GoogleSpreadsheet(spreadSheetId)
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY
  })

  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetId]
  return sheet
}


const loadFileRows = async ({spreadSheetId , sheetId}) => {
  const sheet = await syncSheet({
    spreadSheetId,
    sheetId : sheetId || '0'
  })
  return await sheet.getRows(); 
}


module.exports = {
  syncSheet,
  loadFileRows,
  syncSheetFromUrl
}