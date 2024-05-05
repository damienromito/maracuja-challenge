import React, { createContext, useState, useContext, useEffect } from "react"

const QuitModal = ({ shown, cancel, quit, correctCount }) => {
  return shown ? (
    <>
      <div>
        <div
          style={{
            color: "black",
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            // contentAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              background: "white",
              width: 350,
              padding: 20,
              zIndex: 1,
            }}
          >
            <h3 style={{ textAlign: "center" }}> Une épreuve ne peut pas être interrompue. </h3>
            <div style={{ textAlign: "center" }}>
              ⏳ Attention, <br />
              le temps continue de filer !
            </div>
            <div
              style={{
                display: "flex",
                alignContent: "flex-end",
                alignItems: "flex-end",
                marginTop: 20,
              }}
            >
              {/* <span style={{ cursor: 'pointer', flex: 1 }} onClick={() => quit()}>
                Abandonner 😔
              </span> */}
              <strong style={{ cursor: "pointer", flex: 1 }} onClick={() => cancel()}>
                Reprendre
              </strong>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
          }}
          onClick={() => cancel()}
        />
      </div>
    </>
  ) : null
}

export default QuitModal
