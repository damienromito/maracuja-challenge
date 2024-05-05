import { callApi } from '@maracuja/shared/helpers'
import Activity from './Activity'

class Icebreaker extends Activity {
  constructor(props) {
    super(props)
    Object.assign(this, props)
    if (props.formUrl) {
      this.formId = props.formUrl.match(/\/d\/e\/(.*)\/.*/)[1]
    }
  }

  static getDefaultValues() {
    return {
      formUrl: '',
      preview: '',
      actionButtonText: 'Participer',
      prefilledPlayerIdField: ''
    }
  }

  static async create(params) {
    return await callApi('apiIcebreakerParticipate', params)
  }

  static async createQuestion(params = {
    truth1,
    truth2,
    lie,
    playerId,
    challengeId
  }) {
    return await callApi('apiIcebreakerCreateQuestion', params)
  }
}

export default Icebreaker
