import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Plot } from 'sigplot';
import Plugin from '../src/Plugin';
import { SigPlotContext } from '../src/SigPlotContext';

describe('<Plugin />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds plugin on mount', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const addPluginSpy = vi.spyOn(Plot.prototype, 'add_plugin');

    const mockPlugin = { init: vi.fn(), dispose: vi.fn() };
    const pluginOptions = { display: true };

    render(
      <SigPlotContext.Provider value={plot}>
        <Plugin plugin={mockPlugin} pluginOptions={pluginOptions} />
      </SigPlotContext.Provider>
    );

    expect(addPluginSpy).toHaveBeenCalledTimes(1);
    expect(addPluginSpy.mock.calls[0][0]).toBe(mockPlugin);
    expect(addPluginSpy.mock.calls[0][1]).toBe(pluginOptions);
  });

  it('removes plugin on unmount', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const removePluginSpy = vi.spyOn(Plot.prototype, 'remove_plugin');

    const mockPlugin = { init: vi.fn(), dispose: vi.fn() };

    const { unmount } = render(
      <SigPlotContext.Provider value={plot}>
        <Plugin plugin={mockPlugin} />
      </SigPlotContext.Provider>
    );

    unmount();
    expect(removePluginSpy).toHaveBeenCalledTimes(1);
    expect(removePluginSpy.mock.calls[0][0]).toBe(mockPlugin);
  });
});
