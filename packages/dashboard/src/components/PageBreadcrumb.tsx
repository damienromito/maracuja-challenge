import { Breadcrumb } from "antd"
import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

export default ({ routes }) => {
  function itemRender(route, params, routes, paths) {
    return !route.path ? (
      <span key={route.breadcrumbName}>{route.breadcrumbName}</span>
    ) : (
      <Link key={route.path} to={route.path}>
        {route.breadcrumbName}
      </Link>
    )
  }

  return (
    <Wrapper>
      <Breadcrumb itemRender={itemRender} items={routes} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-bottom: 8px;
  ol {
    padding: 0px;
  }
  nav {
    /* Materialize to delete */
    background-color: inherit !important;
    box-shadow: inherit;
    height: inherit;
  }
  li {
    list-style: none;
  }
`
