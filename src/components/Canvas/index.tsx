import React, { useRef, useState, useEffect, useCallback } from "react";
import { fromEvent, timer } from "rxjs";
import { map, debounce } from "rxjs/operators";

interface canvasProps {
  pageX?: number;
  pageY?: number;
}

export default function Canvas({ pageX = 100, pageY = 100 }: canvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastCoords, setLastCoords] = useState([0, 0]);
  const [hue, setHue] = useState(0);
  const resizeCanvas = useCallback(() => {
    canvas.current.width = window.innerWidth * (pageX / 100);
    canvas.current.height = window.innerHeight * (pageY / 100);
  }, [canvas.current]);

  // event handlers
  const enableDrawing = () => setIsDrawing(true);
  const disableDrawing = () => setIsDrawing(false);
  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setLastCoords([offsetX, offsetY]);

    if (isDrawing && event.nativeEvent) {
      const ctx = canvas!.current ? canvas.current.getContext("2d") : null;

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastCoords[0], lastCoords[1]);
        ctx.lineTo(offsetX, offsetY);
        ctx.lineWidth = Math.abs(50 - (hue % 100));
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.stroke();
        setHue(hue + 1);
      }
    }
  };

  useEffect(() => {
    // TS non-null assertion operator w/dot '!.' explained:
    // (1) assert that canvas is non-null,
    // (2) access canvas.current
    if (canvas!.current) {
      resizeCanvas();

      const ctx = canvas.current.getContext("2d");
      if (ctx !== null) {
        ctx.strokeStyle = "#BADA55";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
      }

      // listen for (and debounce) future window resizes, e.g. due to
      // devtools opening / closing, then resize canvas
      fromEvent(window, "resize")
        .pipe(
          debounce(() => timer(500)),
          map(() => resizeCanvas())
        )
        .subscribe();
    }
  }, [canvas]);

  return (
    <canvas
      ref={canvas}
      width="800"
      height="800"
      onMouseMove={draw}
      onMouseDown={enableDrawing}
      onMouseUp={disableDrawing}
      onMouseOut={disableDrawing}
    />
  );
}
