// blue2 2F3BBD
import styled, { keyframes } from 'styled-components'

const size = {
  borderRadius: '13px',
  padding: '15px'
}

const color = {
  blue_lighten_1: '#213EBB',
  blue_lighten_3: '#52A1FA',
  blue_lighten_4: '#9EE5FF',
  blue: '#2C29AB',
  blue_darken_1: '#2A1EA0',
  orange_lighten_1: '#F6C241',
  orange: '#F37B21',
  orange_darken_1: '#ED4727',
  black_text: '#000',
  gray_lighten_5: '#F5F5F5',
  gray_lighten_4: '#D1D1D1',
  gray: '#9B9B9B',
  gray_darken_1: '#2C322D',
  green_solid: '#00AF42',
  yellow: '#FFDD00'
}

function alphaColor (hex, alpha) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return 'rgba(' +
    parseInt(result[1], 16) + ',' +
    parseInt(result[2], 16) + ',' +
    parseInt(result[3], 16) + ',' +
    alpha + ')'
}

const helpers = {
  alphaColor: alphaColor
}

export default {
  size: size,
  color: color,
  keyframes: keyframes
}

export {
  styled,
  color,
  size,
  helpers,
  keyframes
}
