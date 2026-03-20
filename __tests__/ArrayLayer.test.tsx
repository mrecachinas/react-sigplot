import { render } from '@testing-library/react';
import { Plot } from 'sigplot';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ArrayLayer from '../src/ArrayLayer';
import { SigPlotContext } from '../src/SigPlotContext';

describe('<ArrayLayer />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reloads plot on data prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const random: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random.push(i * 10);
    }

    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].ypoint).toHaveLength(random.length);
    expect(plot._Gx.lyr[0].ypoint).toEqual(new Float64Array(random));

    const random2: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random2.push(i * 10);
    }

    rerender(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random2} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].ypoint).toHaveLength(random2.length);
    expect(plot._Gx.lyr[0].ypoint).toEqual(new Float64Array(random2));
  });

  it("doesn't do anything when props change but remain the same", () => {
    const element = document.createElement('div');
    const options = { framesize: 1000 };
    const plot = new Plot(element, options);

    const random: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random.push(i * 10);
    }

    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random} layerOptions={options} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].size).toBe(1000);

    rerender(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random} layerOptions={options} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr[0].size).toBe(1000);
  });

  it('changes layer settings on layerOptions prop change', () => {
    const element = document.createElement('div');
    const options = { framesize: 1000 };
    const plot = new Plot(element, options);

    const random: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random.push(i * 10);
    }

    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random} layerOptions={options} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].size).toBe(1000);

    const newOptions = { framesize: 50 };
    rerender(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random} layerOptions={newOptions} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr[0].size).toBe(50);
  });

  it('headermods plot on options prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const overlayArraySpy = vi.spyOn(Plot.prototype, 'overlay_array');
    const reloadSpy = vi.spyOn(Plot.prototype, 'reload');
    const headermodSpy = vi.spyOn(Plot.prototype, 'headermod');

    const random: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random.push(i * 10);
    }

    const options = {};
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random} options={options} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].ypoint).toHaveLength(random.length);
    expect(plot._Gx.lyr[0].ypoint).toEqual(new Float64Array(random));
    expect(overlayArraySpy).toHaveBeenCalledTimes(1);
    expect(reloadSpy).toHaveBeenCalledTimes(0);
    expect(headermodSpy).toHaveBeenCalledTimes(0);

    const newOptions = { subsize: 100 };
    rerender(
      <SigPlotContext.Provider value={plot}>
        <ArrayLayer data={random} options={newOptions} />
      </SigPlotContext.Provider>,
    );

    expect(plot._Gx.lyr[0].hcb.subsize).toBe(100);
    expect(overlayArraySpy).toHaveBeenCalledTimes(1);
    expect(reloadSpy).toHaveBeenCalledTimes(0);
    expect(headermodSpy).toHaveBeenCalledTimes(1);
  });
});
