import { useEffect, useRef } from 'react';
import { usePlot } from './SigPlotContext';

export interface ArrayLayerProps {
  data?: number[] | number[][] | ArrayBuffer;
  options?: Record<string, unknown>;
  layerOptions?: Record<string, unknown>;
}

/**
 * ArrayLayer wrapper for sigplot.layer1d and sigplot.layer2d
 *
 * For static 1D and 2D JS arrays/ArrayBuffers.
 *
 *   <SigPlot>
 *     <ArrayLayer data={[1, 2, 3]} />
 *   </SigPlot>
 */
function ArrayLayer({ data, options, layerOptions }: ArrayLayerProps) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);
  const prevDataRef = useRef(data);
  const prevOptionsRef = useRef(options);
  const prevLayerOptionsRef = useRef(layerOptions);

  useEffect(() => {
    layerRef.current = plot.overlay_array(data, options, layerOptions);
    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (layerRef.current === null) return;

    if (data !== prevDataRef.current) {
      plot.reload(layerRef.current, data, options);
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

export default ArrayLayer;
