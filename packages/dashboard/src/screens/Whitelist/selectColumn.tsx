import { useCurrentChallenge } from "@maracuja/shared/contexts"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import Select from "react-select"

const SelectComponent = ({ active, rowData, setRowData, focus, stopEditing, columnData }) => {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [focus])

  return (
    <Select
      ref={ref}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: "stretch",
          pointerEvents: focus ? undefined : "none",
        }),
        control: (provided) => ({
          ...provided,
          height: "100%",
          border: "none",
          boxShadow: "none",
          background: "none",
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      isDisabled={columnData.disabled}
      value={columnData.choices.find(({ value }) => value === rowData) ?? null}
      menuPortalTarget={document.body}
      menuIsOpen={focus}
      onChange={({ value }) => {
        setRowData(value)
        setTimeout(stopEditing, 0)
      }}
      onMenuClose={() => stopEditing({ nextRow: false })}
      options={columnData.choices}
    />
  )
}

export default (options) => ({
  component: SelectComponent,
  columnData: options,
  disableKeys: true,
  keepFocus: true,
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) => options.choices.find((choice) => choice.value === rowData)?.label,
  pasteValue: ({ value }) => options.choices.find((choice) => choice.label === value)?.value ?? null,
})
