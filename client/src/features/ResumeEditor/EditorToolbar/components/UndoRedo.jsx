import { ActionCreators as UndoActionCreators } from "redux-undo";
import { useDispatch } from "react-redux";
import { FaUndo, FaRedo } from "react-icons/fa";

export default function UndoRedo() {
  const dispatch = useDispatch();
  return (
    <div className="flexRow">
      <button
        data-toolbar-label="Undo"
        className="buttonMain"
        onClick={() => dispatch(UndoActionCreators.undo())}
      >
        <FaUndo style={{scale: 0.8}} />
      </button>
      <button
        data-toolbar-label="Redo"
        className="buttonMain"
        onClick={() => dispatch(UndoActionCreators.redo())}
      >
        <FaRedo style={{scale: 0.8}} />
      </button>
    </div>
  );
}
