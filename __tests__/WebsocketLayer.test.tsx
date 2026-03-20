import { render } from '@testing-library/react';
import { Plot } from 'sigplot';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SigPlotContext } from '../src/SigPlotContext';
import WebsocketLayer from '../src/WebsocketLayer';

describe('<WebsocketLayer />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("doesn't reload plot on same wsurl change", () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const deoverlaySpy = vi.spyOn(Plot.prototype, 'deoverlay');
    const overlayWsSpy = vi.spyOn(Plot.prototype, 'overlay_websocket');

    const options = { framesize: 1000 };
    const websocketURL = 'ws://0.0.0.0';
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <WebsocketLayer wsurl={websocketURL} options={options} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    const overlayCountAfterMount = overlayWsSpy.mock.calls.length;

    rerender(
      <SigPlotContext.Provider value={plot}>
        <WebsocketLayer wsurl={websocketURL} options={options} />
      </SigPlotContext.Provider>,
    );

    // No additional overlay_websocket calls since wsurl is same
    expect(overlayWsSpy.mock.calls.length).toBe(overlayCountAfterMount);
    expect(deoverlaySpy).toHaveBeenCalledTimes(0);
  });

  it('reloads plot on wsurl prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const deoverlaySpy = vi.spyOn(Plot.prototype, 'deoverlay');
    const overlayWsSpy = vi.spyOn(Plot.prototype, 'overlay_websocket');

    const options = { framesize: 1000 };
    const websocketURL = 'ws://0.0.0.0';
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <WebsocketLayer wsurl={websocketURL} options={options} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);

    const websocketURL2 = 'ws://0.0.0.0/foo';
    rerender(
      <SigPlotContext.Provider value={plot}>
        <WebsocketLayer wsurl={websocketURL2} options={options} />
      </SigPlotContext.Provider>,
    );

    expect(deoverlaySpy).toHaveBeenCalled();
    expect(overlayWsSpy.mock.calls.at(-1)?.[0]).toBe(websocketURL2);
    expect(plot._Gx.lyr).toHaveLength(1);
  });

  it('throws an error on empty URL', () => {
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      const element = document.createElement('div');
      const plot = new Plot(element, {});
      render(
        <SigPlotContext.Provider value={plot}>
          <WebsocketLayer wsurl="" />
        </SigPlotContext.Provider>,
      );
    }).toThrow();

    console.error = originalError;
  });

  it('changes settings on options prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const options = { drawmode: 'scrolling', framesize: 1000 };
    const websocketURL = 'ws://0.0.0.0';

    const deoverlaySpy = vi.spyOn(Plot.prototype, 'deoverlay');
    const overlayWsSpy = vi.spyOn(Plot.prototype, 'overlay_websocket');

    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <WebsocketLayer wsurl={websocketURL} options={options} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].drawmode).toBe(options.drawmode);

    const newOptions = { drawmode: 'righttoleft' };
    rerender(
      <SigPlotContext.Provider value={plot}>
        <WebsocketLayer wsurl={websocketURL} options={newOptions} />
      </SigPlotContext.Provider>,
    );

    expect(deoverlaySpy).toHaveBeenCalledTimes(0);
    expect(overlayWsSpy).toHaveBeenCalledTimes(1);
    expect(plot._Gx.lyr[0].drawmode).toBe(newOptions.drawmode);
  });
});
