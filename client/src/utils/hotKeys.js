import { Editor } from "slate";

import { toggleMark } from "@/helpers/marks";
import { toggleList } from "@/helpers/blocks";
import { outdentList, indentList, addListItem } from "@/helpers/listBehavior";
import { useSelector } from "react-redux";
import { saveResumeToApi } from "@/services/resumeServices";

export const handleGlobalHotKey = (resume, event) => {
   console.log("handleGlobalHotKey called with event:", event);
   if (event.ctrlKey) {
      switch (event.key) {
         case "s":
         case "S":
            saveResumeToApi(resume);
            break;
      }
   }
   return;
}

export const handleHotKey = (editor, event) => {
   // console.log("handleHotKey called with event:", event);
   if (!editor) {
      console.warn("Editor instance is not available.");
      return;
   }
   
   const [listItemEntry] = Editor.nodes(editor, {
      match: (n) => n.type === "list-item",
   });

   if (listItemEntry) {
      if (event.key === "Enter" || event.key === "Tab") {
         event.preventDefault();
         event.stopPropagation();
         switch (event.key) {
            case "Enter":
               // Editor.normalize(editor, { force: true });
               addListItem(editor, listItemEntry);
               break;
            case "Tab":
               if (event.shiftKey) {
                  outdentList(editor, listItemEntry);
               } else {
                  indentList(editor, listItemEntry);
               }
               // Editor.normalize(editor, { force: true });
               break;
            default:
               break;
         }
      }
      // return;
   }

   // * Handle Ctrl+Shift key combinations * //
   if (event.ctrlKey && event.shiftKey) {
      switch (event.key) {
         case "7":
         case "&":
            toggleList(editor, "ordered-list");
            break;
         case "8":
         case "*":
            toggleList(editor, "unordered-list");
            break;
         default:
            break;
      }
   }

   // * Handle Ctrl key combinations * //
   else if (event.ctrlKey) {
      switch (event.key) {
         case "b":
         case "B":
            toggleMark(editor, "bold");
            break;
         case "i":
         case "I":
            toggleMark(editor, "italic");
            break;
         case "u":
         case "U":
            toggleMark(editor, "underline");
            break;
         // case "s":
         // case "S":
         // toggleMark(editor, "strikeThrough");
         // break;
         default:
            break;
      }
   }
   return;
};