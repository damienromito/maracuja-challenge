import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useFormikContext } from "formik"
import React from "react"
import styled from "styled-components"
import FieldContainer from "../../FormikFieldContainer"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const formik: any = useFormikContext<any>()
  const handleChangeChoiceCount = (e, setFieldValue, choice) => {
    const choiceCountValue = e.target.value
    setFieldValue("choiceCount", choiceCountValue)
  }

  const defautChoiceCount = 3
  return !currentChallenge || currentChallenge.quiz.displayAMaxOfChoices ? (
    <ChoiceCountMaxWrapper>
      <label>Afficher N réponse max</label>
      <FieldContainer className="browser-default" component="select" name="choiceCount">
        {/* <option key='all' value={0}>Toutes ({formik.values.choices.length})</option> */}

        {formik.values.choices?.map((choice, i) => {
          if (i === 0) {
            return (
              <option key={i} value={0}>
                Toutes ({formik.values.choices.length})
              </option>
            )
          }
          // else if (i !== 3) {
          return (
            <option key={i} value={i}>
              {i}
            </option>
          )
          // }
        })}
        {/* {formik.values.choices.length > defautChoiceCount &&
            <option key={formik.values.choices.length + 1} value={0}>Toutes ({formik.values.choices.length})</option>} */}
      </FieldContainer>
      {/* <select
          className='browser-default' id='choice-count-select1' defaultValue={Number(formik.values.choiceCount)}
          onChange={e => handleChangeChoiceCount(e, formik.setFieldValue, formik.values)}
        >
          <option key='all' value={0}>Toutes ({formik.values.choices.length})</option>
          {formik.values.choices?.map((choice, i) => {
            // if (i === 0) {
            //   return <option key={i} value={defautChoiceCount}>{formik.values.choices.length <= defautChoiceCount ? 'Toutes' : defautChoiceCount}</option>
            // } else if (i !== 3) {
            return <option key={`key-${i}`} value={Number(i)}>{i}</option>
            // }
          })} */}
      {/* {formik.values.choices.length > defautChoiceCount &&
            <option key={formik.values.choices.length + 1} value={0}>Toutes ({formik.values.choices.length})</option>} */}
      {/* </select> */}
    </ChoiceCountMaxWrapper>
  ) : null
}

const ChoiceCountMaxWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 202px;

  label {
    color: black;
    font-size: 11px;
    line-height: 15px;
    margin-right: 4px;
    text-align: right;
  }

  select {
    height: 36px;
    width: 102px;
  }
  .input-field label {
    display: none;
  }
`
