import React, { Fragment } from 'react';
import 'highlight.js/styles/github.css';
import { useViewportDimenions } from './useViewportDimensions';
import { useScrollTop } from './useScrollTop';
import { useSlideViewModels } from "./useSlideViewModels";
import { SequenceSlideView } from "./NewImageSequenceSlideView";
import { StandAloneSlideView } from "./StandAloneSlideView";
import { getCurrentSlideIdx } from "./render-helpers";
import { useInitializeRouting } from './useInitializeRouting';

const App: React.FC = () => {
  const scrollTop = useScrollTop();
  const viewportDimensions = useViewportDimenions();
  const slides = useSlideViewModels();
  const initialized = useInitializeRouting(viewportDimensions, slides);

  if (slides.length === 0) {
      return <div style={{ textAlign: "center" }}><img alt="Loading..." src="images/loading.gif"/></div>;
  }

  const content: JSX.Element[] = [];
  const currentSlideIdx = getCurrentSlideIdx(scrollTop, slides);
  if (initialized) {
      if (window.location.hash !== String(currentSlideIdx)) {
          window.location.hash = "#" + currentSlideIdx;
      }
  }

  let heightOffset = 0;
  slides.forEach((slide, idx) => {
    const internalScrollTop = scrollTop - heightOffset;
    if (slide.type === "stand-alone") {
      content.push(
        <StandAloneSlideView
          slide={slide}
          key={idx}
          idx={idx}
          currentIdx={currentSlideIdx}
          scrollTop={internalScrollTop}
          viewportDimensions={viewportDimensions}
        />);
    } else if (slide.type === "sequence") {
      content.push(
        <SequenceSlideView
          slide={slide}
          key={idx}
          idx={idx}
          currentIdx={currentSlideIdx}
          scrollTop={internalScrollTop}
          viewportDimensions={viewportDimensions}
        />);
    } else {
      throw new Error("Unknown slide type: " + slide["type"]);
    }
    heightOffset += slide.slideHeight;
  });

  return (
    <Fragment>
      {content}
    </Fragment>
  );
}

export default App;
