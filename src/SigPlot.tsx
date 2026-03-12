import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { Plot } from 'sigplot';
import { SigPlotContext } from './SigPlotContext';

export interface SigPlotProps {
  children?: ReactNode;
  height?: number;
  width?: number;
  display?: string;
  styles?: CSSProperties;
  options?: Record<string, unknown>;
}

const DEFAULT_OPTIONS: Record<string, unknown> = {
  all: true,
  expand: true,
  autol: 100,
  autohide_panbars: true,
};

/**
 * SigPlot React wrapper component
 *
 * Creates a sigplot.Plot instance and provides it to child layer/plugin
 * components via React Context. Children (e.g., ArrayLayer, PipeLayer)
 * don't render DOM nodes — they perform imperative canvas operations
 * on the parent Plot.
 */
function SigPlot({
  children,
  height = 300,
  width = 300,
  display = 'inline-block',
  styles,
  options = DEFAULT_OPTIONS,
}: SigPlotProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<Plot | null>(null);
  const [plot, setPlot] = useState<Plot | null>(null);
  const prevHeightRef = useRef(height);
  const prevWidthRef = useRef(width);
  const prevOptionsRef = useRef(options);

  // Create Plot instance on mount
  useEffect(() => {
    if (elementRef.current) {
      plotRef.current = new Plot(elementRef.current, options);
      setPlot(plotRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle prop changes
  useEffect(() => {
    if (!plotRef.current) return;

    if (height !== prevHeightRef.current || width !== prevWidthRef.current) {
      plotRef.current.checkresize();
    }

    if (options !== prevOptionsRef.current) {
      plotRef.current.change_settings(options);
    }

    prevHeightRef.current = height;
    prevWidthRef.current = width;
    prevOptionsRef.current = options;
  });

  return (
    <div
      style={{
        height,
        width,
        display,
        ...styles,
      }}
      ref={elementRef}
    >
      <SigPlotContext.Provider value={plot}>
        {plot ? children : null}
      </SigPlotContext.Provider>
    </div>
  );
}

export default SigPlot;
