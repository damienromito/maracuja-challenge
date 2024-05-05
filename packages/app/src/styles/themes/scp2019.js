import { helpers } from '../'

const color = {
  red: '#B3002F',
  red_lighten_1: '#EF7D9B',
  blue: '#02424C',
  blue_lighten_1: '#3686A0',
  blue_lighten_3: '#9BD1D4',
  blue_lighten_gradient: '#2F7D95 linear-gradient(180deg,#2F7D95,#0A4D59)'
}

export default {
  cat: color.red,
  catSecondary: color.blue_lighten_1,
  bg: color.blue,
  logo: color.red,
  navBar: color.blue,
  line: helpers.alphaColor(color.blue_lighten_1, 0.1),
  cellActive: color.blue_lighten_1,
  clubHeader: color.blue_lighten_1,
  overlay: color.blue,
  tableView: color.blue_lighten_gradient,
  errorText: color.red_lighten_1,
  cellButton: color.red,
  userInfo: color.blue_lighten_3,
  titleDate: color.blue_lighten_3,
  phaseCountText: color.blue,
  sectionIcon: color.red,
  tabbarTextOff: color.blue_lighten_3,
  tabbarTextOn: 'white',
  tabbarIconOff: color.blue_lighten_3,
  tabbarIconOn: 'white',
  gameTimer: color.blue,
  blockInfo: color.blue_lighten_3,
  blockInfoTitle: color.blue,
  blockInfoText: color.blue,
  blockInfoSubTitle: color.blue_lighten_1

}
