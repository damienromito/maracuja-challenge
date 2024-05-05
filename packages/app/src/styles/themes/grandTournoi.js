import { helpers } from '../'

const color = {
  orange: '#BF1822',
  orange_lighten_1: '#E0575F',
  blue: '#0C3148',
  blue_lighten_1: '#143A51',
  blue_lighten_3: '#4AA0D32175A7',
  blue_lighten_gradient: '#143A51'
}

export default {
  cat: color.orange,
  catSecondary: color.blue_lighten_1,
  bg: color.blue_lighten_1,
  logo: color.orange,
  navBar: color.blue,
  line: helpers.alphaColor(color.blue_lighten_1, 0.1),
  cellActive: color.blue_lighten_1,
  clubHeader: color.blue_lighten_1,
  overlay: color.blue,
  tableView: color.blue_lighten_gradient,
  errorText: color.orange_lighten_1,
  cellButton: color.orange,
  userInfo: color.blue_lighten_3,
  titleDate: color.blue_lighten_3,
  phaseCountText: color.blue,
  sectionIcon: color.orange,
  tabbarTextOff: color.blue_lighten_3,
  tabbarTextOn: 'white',
  tabbarIconOff: color.blue_lighten_3,
  tabbarIconOn: 'white',
  gameTimer: color.blue,
  blockInfo: color.blue_lighten_3,
  blockInfoTitle: color.blue,
  blockInfoText: color.blue,
  blockInfoSubTitle: color.blue_lighten_1,
  infoText: color.blue_lighten_3
}
