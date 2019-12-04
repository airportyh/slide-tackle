import React from "react";
import { StandAloneSlideViewModel } from "./slide-view-model-types";
import { renderNarration, renderCurrentVisualSlideUp, renderNextVisualSlideUp } from "./render-helpers";
import { Dimensions } from "./Dimensions";

type StandAloneSlideViewProps = {
  scrollTop: number,
  slide: StandAloneSlideViewModel,
  viewportDimensions: Dimensions,
  idx: number,
  currentIdx: number
};

export const StandAloneSlideView: React.FC<StandAloneSlideViewProps> = ({ slide, scrollTop, viewportDimensions, idx, currentIdx }) => {
  const narration = renderNarration(slide, viewportDimensions);

  let visual = null;
  if (idx === currentIdx) {
    visual = renderCurrentVisualSlideUp(slide, scrollTop, viewportDimensions);
  } else if (idx - 1 === currentIdx) {
    visual = renderNextVisualSlideUp(slide, scrollTop, viewportDimensions);
  }
  return (
    <div
      className="slide"
      style={{
        borderBottom: '2px solid black',
        position: 'relative',
        height: slide.slideHeight
      }}>
      { narration }
      { visual }
    </div>
  );
};
