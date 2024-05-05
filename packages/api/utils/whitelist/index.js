const { objectSubset } = require("..")
const { PLAYER_ROLES } = require("../../constants")
const { Team, Club, WhitelistMember, User, Challenge } = require("../../models")

// member.action = "update" | "create" | "delete"
// default action is "create"
const importMembersToWhitelist = async ({ challengeId, members }) => {
  const whitelistByClubs = sortWhitelistByClubs(members)
  const promises = Object.keys(whitelistByClubs).map(async (clubId) => {
    const clubMembers = whitelistByClubs[clubId]
    if (clubId === "undefined" || clubId === "null") {
      return importMembers({ members: clubMembers, challengeId })
    } else {
      return importTeamMembers({ challengeId, teamId: clubId, members: clubMembers })
    }
  })

  await Promise.all(promises)
}

const importTeamMembers = async ({ challengeId, teamId, members }) => {
  const team = await getTeamOrCreate({ id: teamId, challengeId })
  const importedMembers = await importMembers({ members, challengeId })
  return updateTeamWithNewMembers({
    players: team.players,
    newMembers: importedMembers,
    teamId,
    challengeId,
  })
}

const importMembers = async ({ members, challengeId }) => {
  const promises = members.map(async (member) => {
    return updateWhitelistMember({ member, challengeId })
  })
  return await Promise.all(promises)
}

const getTeamOrCreate = async ({ id: teamId, challengeId }) => {
  let team = await Team.fetch({ id: teamId, challengeId })

  if (!team) {
    let club = await Club.fetch({ id: teamId })
    if (!club) {
      club = {
        name: "Aucun nom",
        type: { id: "autre", name: "Autre" },
        tribeId: "autre",
      }
      await Club.create({ id: teamId }, club)
    }
    const challenge = await Challenge.fetch({ id: challengeId })
    const currentPhase = challenge.getCurrentPhase()
    team = await Team.createFromClub(club, {
      challengeId,
      teamId,
      currentPhaseId: currentPhase.id,
    })
  }

  return team
}

const updateWhitelistMember = async ({ member, challengeId }) => {
  if (member.id) {
    if (member.action === "update") {
      await WhitelistMember.update({ challengeId, id: member.id }, { ...memberParseValues(member) })
    } else if (member.action === "delete") {
      await WhitelistMember.delete({ challengeId, id: member.id })
    }
    return member
  } else {
    // CREATE
    const user = await User.fetchByEmail({
      email: member.email.trim().toLowerCase(),
    })

    //TODO check email
    // validateEmail(email)
    //email pas déjà existant
    const newMember = {
      ...memberParseValues(member),
      challengeId,
    }
    if (user) {
      newMember.username = user.username
      newMember.id = user.id
    }
    newMember.id = await WhitelistMember.create(newMember)
    return newMember
  }
}

const memberParseValues = (member) => {
  const newMember = objectSubset(member, ["email", "firstName", "lastName", "phoneNumber"])

  newMember.roles = member.captain ? [PLAYER_ROLES.CAPTAIN] : []
  newMember.clubId = member.team

  if (newMember.phoneNumber) {
    newMember.phoneNumber = filterPhoneNumber(newMember.phoneNumber)
  }

  return newMember
}

const filterPhoneNumber = (phoneNumber) => {
  const number = phoneNumber.replace(/[\s.-]/g, "")
  const check = number.match(/(?:(?:\+|00)?33|0)?(\s*[1-9](?:[\s.-]*\d{2}){4})/)
  if (check) {
    const formatedPhone = "+33" + check[1]
    return formatedPhone
  } else return null
}

const updateTeamWithNewMembers = async ({ players, newMembers, teamId, challengeId }) => {
  const newTeam = {}
  newMembers.forEach((member) => {
    let newMember
    if (member.action === "delete") {
      newMember = fieldValue.delete()
    } else {
      newMember = objectSubset(member, ["firstName", "lastName", "username"])
    }
    newTeam[`members.${member.id}`] = newMember
  })
  await Team.update({ id: teamId, challengeId }, newTeam)
  return true
}

const sortWhitelistByClubs = (whitelist) => {
  const membersByClubId = {}
  whitelist.forEach((member) => {
    let clubMembers = membersByClubId[member.team]
    if (!clubMembers) clubMembers = []
    clubMembers.push(member)
    membersByClubId[member.team] = clubMembers
  })
  return membersByClubId
}

module.exports = {
  importMembersToWhitelist,
}
