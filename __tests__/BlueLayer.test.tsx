import { render } from '@testing-library/react';
import { Plot } from 'sigplot';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BlueLayer from '../src/BlueLayer';
import { SigPlotContext } from '../src/SigPlotContext';

describe('<BlueLayer />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('overlays bluefile data on mount', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const overlayBluefileSpy = vi.spyOn(Plot.prototype, 'overlay_bluefile');

    const data = { buf: new ArrayBuffer(128), type: 1000, subsize: 64 };
    render(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data} />
      </SigPlotContext.Provider>,
    );

    expect(overlayBluefileSpy).toHaveBeenCalledTimes(1);
    expect(overlayBluefileSpy.mock.calls[0][0]).toBe(data);
  });

  it('reloads on data prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const reloadSpy = vi.spyOn(plot, 'reload').mockImplementation(() => {});

    const data1 = { buf: new ArrayBuffer(128) };
    const data2 = { buf: new ArrayBuffer(256) };

    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data1} />
      </SigPlotContext.Provider>,
    );

    expect(reloadSpy).toHaveBeenCalledTimes(0);

    rerender(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data2} />
      </SigPlotContext.Provider>,
    );

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('headermods on options prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const headermodSpy = vi
      .spyOn(plot, 'headermod')
      .mockImplementation(() => {});

    const data = { buf: new ArrayBuffer(128) };
    const options = {};

    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data} options={options} />
      </SigPlotContext.Provider>,
    );

    const newOptions = { subsize: 100 };
    rerender(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data} options={newOptions} />
      </SigPlotContext.Provider>,
    );

    expect(headermodSpy).toHaveBeenCalledTimes(1);
  });

  it('does nothing when props stay the same', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const reloadSpy = vi.spyOn(Plot.prototype, 'reload');
    const headermodSpy = vi.spyOn(Plot.prototype, 'headermod');

    const data = { buf: new ArrayBuffer(128) };

    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data} />
      </SigPlotContext.Provider>,
    );

    rerender(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data} />
      </SigPlotContext.Provider>,
    );

    expect(reloadSpy).toHaveBeenCalledTimes(0);
    expect(headermodSpy).toHaveBeenCalledTimes(0);
  });

  it('removes layer on unmount', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const removeLayerSpy = vi.spyOn(Plot.prototype, 'remove_layer');

    const data = { buf: new ArrayBuffer(128) };

    const { unmount } = render(
      <SigPlotContext.Provider value={plot}>
        <BlueLayer data={data} />
      </SigPlotContext.Provider>,
    );

    unmount();
    expect(removeLayerSpy).toHaveBeenCalled();
  });
});
