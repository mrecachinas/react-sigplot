import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
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
  // Create Plot instance on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
  useEffect(() => {
    if (elementRef.current) {
      plotRef.current = new Plot(elementRef.current, options);
      setPlot(plotRef.current);
    }
    return () => {
      // sigplot's cleanup() is a no-op, so manually remove injected canvases
      if (elementRef.current) {
        while (elementRef.current.firstChild) {
          elementRef.current.removeChild(elementRef.current.firstChild);
        }
      }
      plotRef.current = null;
      setPlot(null);
    };
  }, []);

  // Handle dimension changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-check resize when dimensions change
  useEffect(() => {
    if (!plotRef.current) return;
    plotRef.current.checkresize();
  }, [height, width]);

  // Handle options changes
  useEffect(() => {
    if (!plotRef.current) return;
    plotRef.current.change_settings(options);
  }, [options]);

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
