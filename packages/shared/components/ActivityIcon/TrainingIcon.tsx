import React from "react"
import ProgressionIcon from "./ProgressionIcon"

export default ({ progression, large, locked = false, size = undefined }) => {
  const newSize = size || (large ? 80 : 23)
  const icon = (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        className="icon"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.2495 20.1333H13.8239L16.7798 9.13333H24.2966L27.2495 20.1333ZM23.0537 4.55C22.981 4.22057 22.6888 4 22.361 4H18.7125C18.3847 4 18.0925 4.22057 18.0198 4.55L17.1804 7.66667H23.893L23.0537 4.55ZM27.6516 21.6H13.4222L10.8682 31.1333H30.1684L27.6516 21.6ZM30.5704 32.6H10.4661C8.5321 32.7103 7 34.2873 7 36.2667C7 36.6706 7.3278 37 7.72971 37H33.2696C33.6716 37 33.9993 36.6706 33.9993 36.2667C34.0364 34.323 32.5043 32.7103 30.5703 32.6H30.5704Z"
        fill="black"
      />
    </svg>
  )
  return <ProgressionIcon icon={icon} size={newSize} progression={progression} locked={locked} />
}
