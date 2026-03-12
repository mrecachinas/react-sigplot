import { createContext, useContext } from 'react';
import type { Plot } from 'sigplot';

export const SigPlotContext = createContext<Plot | null>(null);

export function usePlot(): Plot {
  const plot = useContext(SigPlotContext);
  if (!plot) {
    throw new Error('usePlot must be used within a <SigPlot> component');
  }
  return plot;
}
