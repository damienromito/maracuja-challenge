import { Capacitor } from "@capacitor/core"
import { StatusBar, Style } from "@capacitor/status-bar"
import { useEffect } from "react"
// import { StatusBarStyle } from '@ionic-native/status-bar';
const isStatusBarAvailable = Capacitor.isPluginAvailable("StatusBar")

const useStatusBar = () => {
  useEffect(() => {
    setStatusBarLight(true)
    // STATUSBAR

    if (isStatusBarAvailable) {
      StatusBar.show()
      // ANDROID ONLY
      // StatusBar.setOverlaysWebView({ overlay: true });
      // StatusBar.setBackgroundColor({ color: '#ecf0f1' });
      // StatusBar.overlaysWebView(true)
      // StatusBar.backgroundColorByHexString(props.theme.bg.secondary)
    }
  }, [])

  const setStatusBarLight = (isLight) => {
    const isStatusBarAvailable = Capacitor.isPluginAvailable("StatusBar")
    if (isStatusBarAvailable) {
      StatusBar.setStyle({
        style: isLight ? Style.Dark : Style.Light,
      })
    }
  }

  return {
    setStatusBarLight,
  }
}

export default useStatusBar
