import { useState, useEffect } from "react";
import { Dimensions } from "../types/Dimensions";

export function useViewportDimenions() {
    const [viewpointDimensions, setViewportDimensions] = useState<Dimensions>({
      height: window.innerHeight,
      width: window.innerWidth
    });
  
    useEffect(() => {
      const resizeListener = () => {
        setViewportDimensions({
          height: window.innerHeight,
          width: window.innerWidth
        });
      };
  
      window.addEventListener("resize", resizeListener);
      return () => {
        window.removeEventListener("resize", resizeListener);
      };
    });
    return viewpointDimensions;
  }