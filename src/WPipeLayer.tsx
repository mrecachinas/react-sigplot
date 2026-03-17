import { memo, useEffect, useRef } from 'react';
import { usePlot } from './SigPlotContext';

export interface WPipeLayerProps {
  wsurl?: string;
  options?: Record<string, unknown>;
  layerOptions?: Record<string, unknown>;
  fps?: number;
}

/**
 * Wrapper around sigplot.Plot.overlay_wpipe (internal, not exported)
 */
function WPipeLayer({
  wsurl = '',
  options,
  layerOptions,
  fps,
}: WPipeLayerProps) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);
  const prevWsurlRef = useRef(wsurl);
  const prevOptionsRef = useRef(options);
  const prevLayerOptionsRef = useRef(layerOptions);
  const prevFpsRef = useRef(fps);

  useEffect(() => {
    layerRef.current = plot.overlay_wpipe(wsurl, options, layerOptions, fps);
    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (layerRef.current === null) return;

    if (wsurl !== prevWsurlRef.current || fps !== prevFpsRef.current) {
      plot.delete_layer(layerRef.current);
      layerRef.current = plot.overlay_wpipe(
        wsurl,
        options,
        layerOptions,
        fps
      );
    }
    if (options !== prevOptionsRef.current) {
      plot.headermod(layerRef.current, options);
    }
    if (layerOptions !== prevLayerOptionsRef.current && layerOptions != null) {
      plot.get_layer(layerRef.current).change_settings(layerOptions);
    }

    prevWsurlRef.current = wsurl;
    prevOptionsRef.current = options;
    prevLayerOptionsRef.current = layerOptions;
    prevFpsRef.current = fps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsurl, options, layerOptions, fps]);

  return null;
}

export default memo(WPipeLayer);
