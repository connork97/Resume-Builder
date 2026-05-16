import React, { useState } from 'react';

import styles from '../Outline.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateFieldLayout } from '@/store/resumeSlice';

export const StartNewRow = ({fieldId}) => {
   const dispatch = useDispatch();

   const field = useSelector(state => state.resume.fields.byId[fieldId]);
   const [startNewRow, setStartNewRow] = useState(field?.layout?.startNewRow || false)

   const handleSetStartNewRow = () => {
      const updatedStartNewRow = !startNewRow
      setStartNewRow(updatedStartNewRow)
      dispatch(updateFieldLayout({
         id: fieldId,
         changes: { 
            startNewRow: updatedStartNewRow
         }
      }))
   }
   return (
      <div className={styles.startNewRowWrapper}>
         <label htmlFor='startNewRowCheckbox'>
            <input
               id='startNewRowCheckbox'
               type='checkbox'
               checked={startNewRow}
               onChange={handleSetStartNewRow}
               style={{marginRight: '0.5rem'}}
               />
               Start New Row
         </label>
      </div>
   )
}