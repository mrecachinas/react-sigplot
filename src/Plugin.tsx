import { memo, useEffect } from 'react';
import { usePlot } from './SigPlotContext';

export interface PluginProps {
  plugin: unknown;
  pluginOptions?: Record<string, unknown>;
}

/**
 * Plugin wrapper for sigplot plugins
 *
 * Adds a plugin to the plot on mount and removes it on unmount.
 */
function Plugin({ plugin, pluginOptions }: PluginProps) {
  const plot = usePlot();

  useEffect(() => {
    plot.add_plugin(plugin, pluginOptions);
    return () => {
      plot.remove_plugin(plugin);
    };
  }, [plot, plugin, pluginOptions]);

  return null;
}

export default memo(Plugin);
