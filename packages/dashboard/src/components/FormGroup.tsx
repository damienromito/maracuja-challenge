import React from 'react'

export default (props) => {
  return (
    <div {...props} style={{ background: '#eeeeee', padding: 15, marginBottom: 15 }}>
      {props.children}
    </div>
  )
}
