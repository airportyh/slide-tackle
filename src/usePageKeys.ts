import { sleep } from "simple-sleep";
import { useEffect } from "react";
import { SlideViewModel } from "./slide-view-model-types";
import { getCurrentSlideIdx } from "./render-helpers";

export function usePageKeys(slides: SlideViewModel[]) {
  
    useEffect(() => {
      
      if (slides.length === 0) {
        return;
      }
      async function onKeyDown(event: KeyboardEvent) {
        if (event.key === "PageDown") {
          event.preventDefault();
          let heightOffset = 0;
          const scrollTop = window.scrollY;
          const currentSlideIdx = getCurrentSlideIdx(scrollTop, slides);
          for (let i = 0; i <= currentSlideIdx; i++) {
            heightOffset += slides[i].slideHeight;
          }
          for (let i = scrollTop; i <= heightOffset + 1; i+=8) {
            window.scrollTo(0, i);
            await sleep(1);
          }
          window.scrollTo(0, heightOffset + 1);
        } else if (event.key === "PageUp") {
          event.preventDefault();
          const scrollTop = window.scrollY;
          const currentSlideIdx = getCurrentSlideIdx(scrollTop, slides);
          const destinationSlideIdx = currentSlideIdx - 2;
          let heightOffset = 0;
          for (let i = 0; i <= destinationSlideIdx; i++) {
            heightOffset += slides[i].slideHeight;
          }
          for (let i = scrollTop; i >= heightOffset; i-=8) {
            window.scrollTo(0, i);
            await sleep(1);
          }
          window.scrollTo(0, heightOffset + 1);
        }
      }
      
      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
      }
    }, [slides]);
  }