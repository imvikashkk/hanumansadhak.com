"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  y?: number;
};

export function Reveal({ children, delay = 0, className = "", as = "div", y = 24 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      style={{
        transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        opacity: visible ? 1 : 0,
        transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 700ms ease-out ${delay}ms`,
        willChange: "transform, opacity",
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
