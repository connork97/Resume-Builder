import { useState, useEffect } from 'react';

export function useMediaQuery() {
   const windowWidth = window.innerWidth;
   if (windowWidth < 768) {
      return "mobile"
   // } else if (windowWidth < 1024) {
      // return "tablet"
   } else {
      return "desktop"
   }
}
