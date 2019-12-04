import { Dimensions } from "./Dimensions";
import { useState, useEffect } from "react";
import { SlideViewModel } from "./slide-view-model-types";

function getInitialSlideIndex() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        return Number(hash);
    } else {
        return 0;
    }
}

export function useInitializeRouting(viewportDimensions: Dimensions, slides: SlideViewModel[]) {
  const [ initialized, setInitialized ] = useState(false);
  useEffect(() => {
     // handle initial routing
     const initSlideIdx = getInitialSlideIndex();
     if (!initialized && slides.length > 0) {
         let heightOffset = 0;
         for (let i = 0; i <= initSlideIdx; i++) {
             heightOffset += slides[i].slideHeight;
         }
         window.scrollTo(0, heightOffset);
         setInitialized(true);
     }
   }, [slides]);
   return initialized;
}
