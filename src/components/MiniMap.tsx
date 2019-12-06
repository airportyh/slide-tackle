import { SlideViewModel, StandAloneSlideViewModel } from "../types/slide-view-model-types";
import { Dimensions } from "../types/Dimensions";
import React, { Fragment } from "react";

export type MiniMapProps = {
  slides: SlideViewModel[],
  scrollTop: number,
  viewportDimensions: Dimensions
};

export const MiniMap: React.FC<MiniMapProps> = ({ slides, scrollTop, viewportDimensions }) => {
  const colors = [
    "#aaa",
    "#eee",
  ];
  const flatSlides = slides.reduce((flattened, slide) => {
    if (slide.type === "sequence") {
      return flattened.concat(slide.sequence);
    } else if (slide.type === "stand-alone"){
      return flattened.concat([slide]);
    } else {
      return [];
    }
  }, [] as StandAloneSlideViewModel[]);
  const totalHeight = slides.reduce((height, slide) => height + slide.slideHeight, 0);
  if (totalHeight === 0) {
    return <Fragment/>;
  }
  let currentSlide;
  let currentSlideIdx;
  let heightOffset = 0;

  for (let i = 0; i < flatSlides.length; i++) {
    const slide = flatSlides[i];
    if (scrollTop <= heightOffset + slide.slideHeight) {
      currentSlide = slide;
      currentSlideIdx = i;
      break;
    }
    heightOffset += slide.slideHeight;
  }
  if (currentSlideIdx === undefined || !currentSlide) {
    return <Fragment>Couldn't find currentSlide</Fragment>;
  }
  // const currentSlide = flatSlides[currentSlideIdx];
  return (
    <div
      className="minimap"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: 16,
        zIndex: 1
      }}>
      <div
        className="minimap-viewport"
        style={{
          position: 'fixed',
          height: (100 * viewportDimensions.height / totalHeight) + '%',
          width: '100%',
          top: (100 * scrollTop / totalHeight) + '%',
          backgroundColor: 'yellow'
        }}>
      </div>
      {flatSlides.map((slide, idx) => {
        const color = colors[idx % colors.length];
        return (
          <div
            key={idx}
            className="minimap-slide"
            style={{
              height: (100 * slide.slideHeight / totalHeight) + '%',
              width: '100%',
              backgroundColor: color,
              opacity: 0.5
            }}
          ></div>
        );
      })}
    </div>
  );
};
