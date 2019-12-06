import React, { Fragment } from "react";
import { SequenceSlideViewModel } from "./slide-view-model-types";
import { Dimensions } from "./Dimensions";
import { renderNarration, getCurrentSlideIdx,
    renderCurrentVisualSlideUp, renderNextVisualSlideUp,
    renderCurrentVisualSwipeUp, renderNextVisualSwipeUp } from "./render-helpers";
import { AppOptions } from "./App";

type SequenceSlideViewProps = {
    idx: number,
    slide: SequenceSlideViewModel,
    currentIdx: number,
    scrollTop: number,
    viewportDimensions: Dimensions,
    options: AppOptions
};

export const SequenceSlideView: React.FC<SequenceSlideViewProps> =
({ slide, scrollTop, viewportDimensions, idx: parentIdx, currentIdx: parentCurrentIdx, options }) => {
    const childSlides = slide.sequence;
    const totalHeight = childSlides.reduce((height, slide) => height + slide.slideHeight, 0);
    if (totalHeight === 0) {
        return <Fragment/>;
    }

    const currentSlideIdx = getCurrentSlideIdx(scrollTop, childSlides);

    let heightOffset = 0;
    return (
        <Fragment>
        {
            childSlides.map((slide, idx) => {
                const narration = renderNarration(slide, viewportDimensions, options);
                let visual = null;
                const internalScrollTop = scrollTop - heightOffset;
                if (parentIdx === parentCurrentIdx) {
                    if (currentSlideIdx === idx) { // current
                        if (idx === childSlides.length - 1) {
                            visual = renderCurrentVisualSlideUp(slide, internalScrollTop, viewportDimensions, options);
                        } else {
                            visual = renderCurrentVisualSwipeUp(slide, internalScrollTop, viewportDimensions, options);
                        }
                    } else if (currentSlideIdx === idx - 1) { // next
                        visual = renderNextVisualSwipeUp(slide, internalScrollTop, viewportDimensions, options);
                    }
                } else if (parentIdx - 1 === parentCurrentIdx) {
                    if (idx === 0) {
                        visual = renderNextVisualSlideUp(slide, internalScrollTop, viewportDimensions, options);
                    }
                }
                heightOffset += slide.slideHeight;
                return (
                    <div
                    className="slide"
                    key={idx}
                    style={{
                        borderBottom: '2px solid black',
                        height: slide.slideHeight
                    }}>
                    { narration }
                    { visual }
                    </div>
                )
            })
        }
        </Fragment>
    );
};
