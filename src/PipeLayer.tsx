import { memo, useEffect, useRef } from 'react';
import { usePlot } from './SigPlotContext';

export interface PipeLayerProps {
  data?: number[] | ArrayBuffer;
  options?: Record<string, unknown>;
  layerOptions?: Record<string, unknown>;
}

/**
 * Wrapper around sigplot.Plot.overlay_pipe
 *
 * For streaming 1-D plots or 2-D raster waterfall plots.
 *
 *   <SigPlot>
 *     <PipeLayer options={options} data={data} />
 *   </SigPlot>
 */
function PipeLayer({ data, options, layerOptions }: PipeLayerProps) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);
  const prevDataRef = useRef(data);
  const prevOptionsRef = useRef(options);
  const prevLayerOptionsRef = useRef(layerOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
  useEffect(() => {
    layerRef.current = plot.overlay_pipe(options, layerOptions);

    if (
      data !== undefined &&
      (Array.isArray(data) ? data.length > 0 : data instanceof ArrayBuffer)
    ) {
      plot.push(layerRef.current, data);
    }

    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (layerRef.current === null) return;

    if (data && data !== prevDataRef.current) {
      plot.push(layerRef.current, data, options);
    }
    if (options !== prevOptionsRef.current) {
      plot.headermod(layerRef.current, options);
    }
    if (layerOptions !== prevLayerOptionsRef.current && layerOptions != null) {
      plot.get_layer(layerRef.current).change_settings(layerOptions);
    }

    prevDataRef.current = data;
    prevOptionsRef.current = options;
    prevLayerOptionsRef.current = layerOptions;
  }, [data, options, layerOptions, plot]);

  return null;
}

export default memo(PipeLayer);
