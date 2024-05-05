import Activity from './Activity'
import { callApi } from '@maracuja/shared/helpers'

class Lottery extends Activity {
  static collectionPath({ challengeId }) { return `challenges/${challengeId}/lotteries` }
  collectionPath() { return `challenges/${this.challengeId}/lotteries` }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    if (props) {
      this.drawDate = props.drawDate?.toDate()
    }
  }

  static getDefaultValues() {
    return {
      image: '',
      drawDate: new Date(),
      link: '',
      prizesInfo: '',
      winnerCount: 1
    }
  }

  drawWinnersLottery() {
    const params = {
      winnerCount: this.winnerCount,
      subscriptionCount: this.subscriptionCount,
      lotteryId: this.id,
      challengeId: this.challengeId
    }

    return callApi('apiLotteriesDrawWinners', params)
  }

  // ACTIVITIES
  static subscribeLottery(data) {
    return callApi('apiLotteriesSubscribe', data)
  }
}

export default Lottery
