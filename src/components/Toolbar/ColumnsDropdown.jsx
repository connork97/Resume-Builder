import React from "react";

export default function ColumnsDropdown({ numColumns, setNumColumns }) {
     return (
          <select value={numColumns} onChange={e => setNumColumns(Number(e.target.value))}>
               <option value={1}>1 Column</option>
               <option value={2}>2 Columns</option>
               <option value={3}>3 Columns</option>
               <option value={4}>4 Columns</option>
               <option value={5}>5 Columns</option>
          </select>
     )
}