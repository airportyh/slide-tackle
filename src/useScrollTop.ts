import { useState, useEffect } from "react";

export function useScrollTop() {
    const [scrollTop, setScrollTop] = useState<number>(window.scrollY);
  
    useEffect(() => {
      const scrollListener = () => {
        setScrollTop(window.scrollY);
      };
  
      window.addEventListener("scroll", scrollListener);
      return () => {
        window.removeEventListener("scroll", scrollListener);
      };
    });
  
    return scrollTop;
  }