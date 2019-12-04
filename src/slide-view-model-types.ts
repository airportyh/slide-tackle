import { StandAloneSlide, SequenceSlide } from "./slide-types";
import { Dimensions } from "./Dimensions";

export type StandAloneSlideViewModel = {
    type: "stand-alone",
    slide: StandAloneSlide,
    slideHeight: number,
    visualDimensions: Dimensions,
    html: string
};

export type SequenceSlideViewModel = {
    type: "sequence",
    slide: SequenceSlide,
    sequence: StandAloneSlideViewModel[],
    slideHeight: number,
};

export type SlideViewModel = StandAloneSlideViewModel | SequenceSlideViewModel;

export type SlideState = "current" | "next" | "hidden";
