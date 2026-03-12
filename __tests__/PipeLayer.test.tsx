import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Plot } from 'sigplot';
import PipeLayer from '../src/PipeLayer';
import { SigPlotContext } from '../src/SigPlotContext';

describe('<PipeLayer />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('modifies the header on options prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const headermodSpy = vi.spyOn(Plot.prototype, 'headermod');

    const data: number[] = [];
    const options = { framesize: 1000, type: 2000, subsize: 1000 };
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={data} options={options} />
      </SigPlotContext.Provider>
    );

    expect(plot._Gx.lyr).toHaveLength(1);

    headermodSpy.mockClear();

    const newOptions = { framesize: 2000 };
    rerender(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={data} options={newOptions} />
      </SigPlotContext.Provider>
    );

    expect(headermodSpy).toHaveBeenCalledTimes(1);
  });

  it('modifies settings on layerOptions prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const data: number[] = [];
    const layerOptions = { drawmode: 'scrolling' };
    const options = { framesize: 1000, type: 2000, subsize: 1000 };
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={data} options={options} layerOptions={layerOptions} />
      </SigPlotContext.Provider>
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].drawmode).toBe(layerOptions.drawmode);

    const newLayerOptions = { drawmode: 'righttoleft' };
    rerender(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={data} options={options} layerOptions={newLayerOptions} />
      </SigPlotContext.Provider>
    );

    expect(plot._Gx.lyr[0].drawmode).toBe(newLayerOptions.drawmode);
  });

  it('pushes new data to plot on data prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const twoDimensionalData: number[] = [];
    const options = { framesize: 1000, type: 2000, subsize: 1000 };
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={twoDimensionalData} options={options} />
      </SigPlotContext.Provider>
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].hcb.subsize).toBe(1000);
    expect(plot._Gx.lyr[0].hcb.type).toBe(2000);

    const random: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random.push(i * 10);
    }
    rerender(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={random} options={options} />
      </SigPlotContext.Provider>
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    expect(plot._Gx.lyr[0].hcb.subsize).toBe(1000);
    expect(plot._Gx.lyr[0].hcb.type).toBe(2000);
  });

  it("doesn't replot the same data on data prop change", () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const pushSpy = vi.spyOn(Plot.prototype, 'push');

    const random: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random.push(i * 10);
    }

    const options = { framesize: 1000, type: 2000, subsize: 1000 };
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={random} options={options} />
      </SigPlotContext.Provider>
    );

    expect(plot._Gx.lyr).toHaveLength(1);
    const pushCountAfterMount = pushSpy.mock.calls.length;

    // Same reference, should not push again
    rerender(
      <SigPlotContext.Provider value={plot}>
        <PipeLayer data={random} options={options} />
      </SigPlotContext.Provider>
    );

    expect(pushSpy.mock.calls.length).toBe(pushCountAfterMount);
  });
});
