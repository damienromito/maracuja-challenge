import { MailFilled, MessageFilled } from "@ant-design/icons"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { callApi } from "@maracuja/shared/helpers"
import { WhitelistMember } from "@maracuja/shared/models"
import { Button, notification, Space } from "antd"
import React from "react"
import "react-datasheet-grid/dist/style.css"
import { useDashboard } from "../../contexts"

export default ({ members }) => {
  const { setLoading, challengeSettings } = useDashboard()
  const { authUser } = useAuthUser()
  const { currentChallenge } = useCurrentChallenge()
  const lastSendAt = challengeSettings?.captainBriefing?.lastSendAt?.toDate()

  const handleSendSubscriptionEmail = async ({ retry = false, testMembers = null } = {}) => {
    setLoading(true)
    await WhitelistMember.sendSubscriptionEmail({ challengeId: currentChallenge.id, retry, testMembers })
    setLoading(false)
  }

  const handleSendSubscriptionEmailRetry = async () => {
    handleSendSubscriptionEmail({ retry: true })
  }

  const handleTestSendSubscriptionEmail = async () => {
    handleSendSubscriptionEmail({
      testMembers: [{ email: authUser.email, firstName: authUser.firstName }],
    })
  }
  const handleTestSendSubscriptionEmailRetry = async () => {
    handleSendSubscriptionEmail({
      testMembers: [{ email: authUser.email, firstName: authUser.firstName }],
      retry: true,
    })
  }

  const handleSendSubscriptionSms = async ({ retry = false, testMembers = null } = null) => {
    setLoading(true)
    await WhitelistMember.sendSubscriptionSms({ challengeId: currentChallenge.id, retry, testMembers })
    setLoading(false)
  }

  const handleTestSendSubscriptionSms = async () => {
    handleSendSubscriptionSms({ testMembers: [{ phoneNumber: "+33631499857", firstName: "Damien" }] })
  }

  const handleSendSubscriptionSmsRetry = async () => {
    handleSendSubscriptionSms({ retry: true })
  }

  const handleTestSendSubscriptionSmsRetry = async () => {
    handleSendSubscriptionSms({ retry: true, testMembers: [{ phoneNumber: "+33631499857", firstName: "Damien" }] })
  }

  const handleSendCaptainMissionEmail = async () => {
    sendCommunicationEmail({
      emailTemplateType: "captainBriefing",
      sendMessageToString: "à tous les capitaines",
    })
  }

  const sendCommunicationEmail = async ({ emailTemplateType, sendMessageToString }) => {
    if (window.confirm("Etes vous sur de vouloir envoyer un email " + sendMessageToString + " ?")) {
      setLoading(true)
      await callApi("apiCommunicationsSendEmail", {
        challengeId: currentChallenge.id,
        emailTemplateType,
      })
      notification.open({ message: "Email de briefing envoyé " + sendMessageToString })
      setLoading(false)
    }
  }

  const SubscriptionEmailButton = () => {
    const emailsToSentCount = members?.reduce(
      (total, m) => total + (m.subscriptionNotificationEmailState === "en attente" ? 1 : 0),
      0
    )
    const emailsToSentRetryCount = members?.reduce(
      (total, m) => total + (m.subscriptionNotificationEmailState === "envoyé" ? 1 : 0),
      0
    )

    return (
      <Space>
        <Button
          type="primary"
          onClick={() => handleSendSubscriptionEmail()}
          size="small"
          icon={<MailFilled />}
          disabled={!emailsToSentCount}
        >
          Envoyer email ({emailsToSentCount})
        </Button>
        <Button onClick={handleTestSendSubscriptionEmail} size="small">
          Test
        </Button>
        <Button
          type="primary"
          onClick={() => handleSendSubscriptionEmailRetry()}
          size="small"
          icon={<MailFilled />}
          disabled={!emailsToSentRetryCount}
        >
          Envoyer relance ({emailsToSentRetryCount})
        </Button>
        <Button onClick={() => handleTestSendSubscriptionEmailRetry()} size="small">
          Test
        </Button>
        {currentChallenge.audience.whitelistWithCaptains && (
          <Button onClick={() => handleSendCaptainMissionEmail()} size="small" disabled={lastSendAt}>
            Briefer les capitaines
          </Button>
        )}
      </Space>
    )
  }

  const SubscriptionSmsButton = () => {
    const smsToSentCount = members?.reduce(
      (total, m) => total + (m.subscriptionNotificationSmsState === "en attente" ? 1 : 0),
      0
    )
    const smsToSentRetryCount = members?.reduce(
      (total, m) => total + (m.subscriptionNotificationSmsState === "envoyé" ? 1 : 0),
      0
    )

    return (
      <Space>
        <Button
          type="primary"
          onClick={() => handleSendSubscriptionSms()}
          size="small"
          icon={<MessageFilled />}
          disabled={!smsToSentCount}
        >
          Envoyer Sms ({smsToSentCount})
        </Button>
        <Button onClick={() => handleTestSendSubscriptionSms()} size="small">
          Test
        </Button>
        <Button
          type="primary"
          onClick={() => handleSendSubscriptionSmsRetry()}
          size="small"
          icon={<MessageFilled />}
          disabled={!smsToSentRetryCount}
        >
          Envoyer Relance ({smsToSentRetryCount})
        </Button>
        <Button onClick={() => handleTestSendSubscriptionSmsRetry()} size="small">
          Test
        </Button>
      </Space>
    )
  }

  return (
    <Space direction="vertical" style={{ padding: "0 0 8px 0" }}>
      <strong>Envoyer invitation d'inscription</strong>
      <SubscriptionEmailButton />
      {currentChallenge.audience.whitelistWithPhoneNumber && <SubscriptionSmsButton />}
    </Space>
  )
}
