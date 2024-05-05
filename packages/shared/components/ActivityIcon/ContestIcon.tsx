import React from "react"
import styled from "styled-components"
import ActivityIcon from "."

export default ({ score, size = false, large = false, debriefed = false, locked = false }) => {
  const newSize = size || (large ? 80 : 25)

  return (
    <ContestIconWrapper size={newSize} score={score} debriefed={debriefed} locked={locked}>
      <div className="backgroundIcon">
        {score !== null && <span>{score}</span>}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="icon"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M36.9506 18.1665C37.7844 17.3445 38.1475 16.511 37.9451 15.895C37.7428 15.279 36.9771 14.8267 35.82 14.663L28.2232 13.5408C27.2419 13.3907 26.1264 12.5687 25.6952 11.6659L22.3222 4.67084C21.7984 3.60248 21.1386 3 20.5071 3C19.8755 3 19.2157 3.60253 18.692 4.67084L15.2906 11.6797C14.8462 12.5825 13.7439 13.4045 12.7626 13.5546L5.17889 14.6634C4.02178 14.827 3.256 15.2794 3.05372 15.8954C2.85141 16.5113 3.22767 17.3333 4.06147 18.1668L9.55953 23.6145C10.2724 24.3268 10.6883 25.655 10.5276 26.6405L9.2362 34.3324C9.03389 35.4951 9.22296 36.3864 9.73344 36.7694C10.2439 37.1525 11.1326 37.0562 12.1668 36.4961L18.9562 32.8541C19.8298 32.3882 21.2024 32.3882 22.0892 32.8541L28.8786 36.4961C29.9147 37.0428 30.7883 37.139 31.312 36.7694C31.8225 36.3863 32.0116 35.497 31.8092 34.3324L30.5178 26.6405C30.3571 25.6415 30.7731 24.3133 31.4859 23.6145L36.9506 18.1665Z"
            fill="black"
          />
        </svg>
      </div>
    </ContestIconWrapper>
  )
}

interface ContestIconWrapperProps {
  score?: number
  debriefed: boolean
}
const ContestIconWrapper = styled(ActivityIcon)<ContestIconWrapperProps>`
  .backgroundIcon {
    svg .icon {
      fill: ${(props) =>
        props.score !== undefined
          ? props.debriefed
            ? props.theme.icon.completed
            : props.theme.icon.inProgress
          : props.theme.icon.disabled};
    }
  }
  span {
    text-align: center;
    width: ${(props) => props.size + "px"};
    height: ${(props) => props.size + "px"};
    position: absolute;
    font-size: ${(props) => props.size / 2.2 + "px"};
    font-family: Montserrat, Verdana;
    font-weight: 600;
    padding-top: "2px";
    line-height: ${(props) => props.size + props.size * 0.15 + "px"};
    color: #3c3e2f;
  }
`
