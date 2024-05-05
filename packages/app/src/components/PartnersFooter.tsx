import React, { useState, Fragment } from "react"

import { styled, color, size } from "../styles"

const Container = styled.div<{ size: any }>`
  background: white;
  align-items: center;
  display: flex;
  max-height: ${(props) => props.size};
  flex-direction: row;
  justify-content: space-around;
  padding: 0 15px;
  .partner {
    text-align: center;
    /* height: 100%; */
    padding: 10px 0;
    flex: 1;
  }
  img {
    max-width: 100%;
    max-height: 80px;
  }
`

const PartnersFooter = ({ partners, size = "100px" }) => {
  return (
    <Container size={size}>
      {partners.map((partner) => {
        return (
          <div className="partner" key={partner.id}>
            <img alt={partner.name} src={partner.image} />
          </div>
        )
      })}
    </Container>
  )
}

export default PartnersFooter
