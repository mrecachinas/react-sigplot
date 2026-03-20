import { memo, useEffect, useRef } from 'react';
import { usePlot } from './SigPlotContext';

export interface WebsocketLayerProps {
  wsurl?: string;
  overrides?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

/**
 * Wrapper around sigplot.Plot.overlay_websocket
 *
 *   <SigPlot>
 *     <WebsocketLayer wsurl="ws://localhost:8080" />
 *   </SigPlot>
 */
function WebsocketLayer({
  wsurl = '',
  overrides,
  options,
}: WebsocketLayerProps) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);
  const prevWsurlRef = useRef(wsurl);
  const prevOverridesRef = useRef(overrides);
  const prevOptionsRef = useRef(options);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
  useEffect(() => {
    layerRef.current = plot.overlay_websocket(wsurl, overrides, options);
    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (layerRef.current === null) return;

    if (
      wsurl !== prevWsurlRef.current ||
      overrides !== prevOverridesRef.current
    ) {
      plot.deoverlay(layerRef.current);
      layerRef.current = plot.overlay_websocket(wsurl, overrides, options);
    } else if (options !== prevOptionsRef.current) {
      const layer = plot.get_layer(layerRef.current);
      if (layer && options != null) {
        layer.change_settings(options);
      }
    }

    prevWsurlRef.current = wsurl;
    prevOverridesRef.current = overrides;
    prevOptionsRef.current = options;
  }, [wsurl, overrides, options, plot]);

  return null;
}

export default memo(WebsocketLayer);
