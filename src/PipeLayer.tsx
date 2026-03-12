import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    layerRef.current = plot.overlay_pipe(options, layerOptions);

    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      plot.push(layerRef.current, data);
    }

    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (layerRef.current === null) return;

    if (data && data !== prevDataRef.current) {
      plot.push(layerRef.current, data, options);
    } else if (options !== prevOptionsRef.current) {
      plot.headermod(layerRef.current, options);
    } else if (layerOptions !== prevLayerOptionsRef.current) {
      plot.get_layer(layerRef.current).change_settings(layerOptions!);
    }

    prevDataRef.current = data;
    prevOptionsRef.current = options;
    prevLayerOptionsRef.current = layerOptions;
  });

  return null;
}

export default PipeLayer;
