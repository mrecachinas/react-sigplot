import { memo, useEffect, useRef } from 'react';
import { usePlot } from './SigPlotContext';

export interface HrefLayerProps {
  href?: string;
  onload?: ((hcb: unknown) => void) | null;
  options?: Record<string, unknown>;
}

/**
 * Wrapper around sigplot.Plot.overlay_href
 *
 *   <SigPlot>
 *     <HrefLayer href="/path/to/file.tmp" />
 *   </SigPlot>
 */
function HrefLayer({ href = '', onload = null, options }: HrefLayerProps) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);
  const prevHrefRef = useRef(href);
  const prevOptionsRef = useRef(options);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
  useEffect(() => {
    layerRef.current = plot.overlay_href(href, onload, options);
    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (layerRef.current === null) return;

    if (href !== prevHrefRef.current) {
      plot.deoverlay(layerRef.current);
      layerRef.current = plot.overlay_href(href, onload, options);
    } else if (options !== prevOptionsRef.current) {
      const layer = plot.get_layer(layerRef.current);
      if (layer && options != null) {
        layer.change_settings(options);
      }
    }

    prevHrefRef.current = href;
    prevOptionsRef.current = options;
  }, [href, onload, options, plot]);

  return null;
}

export default memo(HrefLayer);
