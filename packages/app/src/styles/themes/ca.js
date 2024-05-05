import defaultTheme from "./defaultTheme"

const bg = {
  secondary: "#075C6B",
  tertiary: "#0F3F47",
  info: "#99B6BB",
  active: "#0E6A7A",
  // error: "#FFD0CD",
  // game: "#F5F5F5",
  // correct: "#E6FFD3",
}

const text = {
  // error: "#FABF94",
  // gameError: "#D0021B",
  // disabled: "#AAAAAA",
  tertiary: "#99B6BB",
  // primary: "#FFFFFF",
  // primary_alpha50: "rgba(255,255,255,0.5)",
  // secondary: "#000000",
  // correct: "#7CC247",
}

const icon = {
  // maracuja: "#99222A",
  // inProgress: "#A7D0FD",
  // highlighted: "#FFDD00",
  primary: "#99B6BB",
  // navigation: "#FFFFFF",
  // disabled: "rgba(0,0,0,0.40)", // '#211F80',
  // disabledProgression: "#211F80", // 'rgba(0,0,0,0.25)',
  // completed: "#FFDD00",
  // referee: "#E6FFD3",
}

const button = {
  secondary: "#0E2F35",
  // error: "#D0021B",
  // disabled: "#D1D1D1",
  // primaryActive: "#C16723",
  // secondaryActive: "#4134BA",
  // correct: "#7CC247",
  // selected: "#FFFFFF",
  // gameOption: "#000000",
  // completed: "#A7D0FD",
}

const theme = Object.assign({}, defaultTheme)
theme.bg = { ...theme.bg, ...bg }
theme.button = { ...theme.button, ...button }
theme.icon = { ...theme.icon, ...icon }
theme.text = { ...theme.text, ...text }
export default theme
