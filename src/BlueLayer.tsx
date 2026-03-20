import { memo, useEffect, useRef } from 'react';
import { usePlot } from './SigPlotContext';

export interface BlueLayerProps {
  data?: unknown;
  options?: Record<string, unknown>;
  layerOptions?: Record<string, unknown>;
}

/**
 * BlueLayer wrapper for sigplot Bluefile format
 *
 *   <SigPlot>
 *     <BlueLayer data={hcb} />
 *   </SigPlot>
 */
function BlueLayer({ data, options, layerOptions }: BlueLayerProps) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);
  const prevDataRef = useRef(data);
  const prevOptionsRef = useRef(options);
  const prevLayerOptionsRef = useRef(layerOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
  useEffect(() => {
    layerRef.current = plot.overlay_bluefile(data, layerOptions);
    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (layerRef.current === null) return;

    if (data !== prevDataRef.current) {
      plot.reload(layerRef.current, data as number[], options);
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

export default memo(BlueLayer);
