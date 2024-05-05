const fs = require("fs")

//template = "default" | "none"
const emailBuilder = ({ folder = "", layoutList = [], forAdmin = false, notAddHeaderAndFooter }) => {
  let content = ""
  if (!layoutList.length) {
    content = fs.readFileSync(`./data/emails/${folder}/content.html`, "utf-8")
  } else {
    layoutList.forEach((layoutName) => {
      content = content + fs.readFileSync(`./data/emails/${folder ? folder + "/" : ""}${layoutName}.html`, "utf-8")
    })
  }

  if (notAddHeaderAndFooter) {
    return content
  } else {
    const htmlheader = fs.readFileSync("./data/emails/header.html", "utf-8")
    const htmlfooter = fs.readFileSync(`./data/emails/${forAdmin ? "footerAdmin" : "footerPlayer"}.html`, "utf-8")
    return htmlheader + content + htmlfooter
  }
}

module.exports = {
  emailBuilder,
}
