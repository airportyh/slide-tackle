import React from "react";
import { StandAloneSlideViewModel } from "./slide-view-model-types";
import { renderNarration, renderCurrentVisualSlideUp, renderNextVisualSlideUp } from "./render-helpers";
import { Dimensions } from "./Dimensions";
import { AppOptions } from "./App";

type StandAloneSlideViewProps = {
  scrollTop: number,
  slide: StandAloneSlideViewModel,
  viewportDimensions: Dimensions,
  idx: number,
  currentIdx: number,
  options: AppOptions
};

export const StandAloneSlideView: React.FC<StandAloneSlideViewProps> = ({
  slide, scrollTop, viewportDimensions, idx, currentIdx, options }) => {
  const narration = renderNarration(slide, viewportDimensions, options);

  let visual = null;
  if (idx === currentIdx) {
    visual = renderCurrentVisualSlideUp(slide, scrollTop, viewportDimensions, options);
  } else if (idx - 1 === currentIdx) {
    visual = renderNextVisualSlideUp(slide, scrollTop, viewportDimensions, options);
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
