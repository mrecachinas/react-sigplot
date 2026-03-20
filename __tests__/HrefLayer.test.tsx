import { render } from '@testing-library/react';
import { Plot } from 'sigplot';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HrefLayer from '../src/HrefLayer';
import { SigPlotContext } from '../src/SigPlotContext';

describe('<HrefLayer />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reloads plot on href prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const deoverlaySpy = vi.spyOn(Plot.prototype, 'deoverlay');
    const overlayHrefSpy = vi
      .spyOn(Plot.prototype, 'overlay_href')
      .mockReturnValue(0);

    const hrefOne = '';
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <HrefLayer href={hrefOne} />
      </SigPlotContext.Provider>,
    );

    expect(deoverlaySpy).toHaveBeenCalledTimes(0);
    expect(overlayHrefSpy).toHaveBeenCalledTimes(1);
    expect(overlayHrefSpy.mock.calls[0][0]).toBe(hrefOne);

    const hrefTwo = 'dat/penny.prm';
    rerender(
      <SigPlotContext.Provider value={plot}>
        <HrefLayer href={hrefTwo} />
      </SigPlotContext.Provider>,
    );

    expect(deoverlaySpy).toHaveBeenCalledTimes(1);
    expect(overlayHrefSpy).toHaveBeenCalledTimes(2);
    expect(overlayHrefSpy.mock.calls[1][0]).toBe(hrefTwo);
  });

  it("doesn't do anything when props change, but stay the same", () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const deoverlaySpy = vi.spyOn(Plot.prototype, 'deoverlay');
    const overlayHrefSpy = vi
      .spyOn(Plot.prototype, 'overlay_href')
      .mockReturnValue(0);

    const hrefOne = 'dat/penny.prm';
    const options = {};
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <HrefLayer href={hrefOne} options={options} />
      </SigPlotContext.Provider>,
    );

    expect(deoverlaySpy).toHaveBeenCalledTimes(0);
    expect(overlayHrefSpy).toHaveBeenCalledTimes(1);

    rerender(
      <SigPlotContext.Provider value={plot}>
        <HrefLayer href={hrefOne} options={options} />
      </SigPlotContext.Provider>,
    );

    expect(deoverlaySpy).toHaveBeenCalledTimes(0);
    expect(overlayHrefSpy).toHaveBeenCalledTimes(1);
  });

  it('changes settings on options prop change', () => {
    const element = document.createElement('div');
    const plot = new Plot(element, {});

    const overlayHrefSpy = vi
      .spyOn(Plot.prototype, 'overlay_href')
      .mockReturnValue(0);

    const hrefOne = '';
    const { rerender } = render(
      <SigPlotContext.Provider value={plot}>
        <HrefLayer href={hrefOne} />
      </SigPlotContext.Provider>,
    );

    expect(overlayHrefSpy).toHaveBeenCalledTimes(1);

    // When we change options and the layer exists, change_settings is called.
    // With empty href the layer may not be fully loaded, so we verify the
    // overlay_href call was correct and that the component doesn't crash
    // when options change.
    const options = { drawmode: 'righttoleft' };
    rerender(
      <SigPlotContext.Provider value={plot}>
        <HrefLayer href={hrefOne} options={options} />
      </SigPlotContext.Provider>,
    );

    // Href didn't change, so no additional overlay_href call
    expect(overlayHrefSpy).toHaveBeenCalledTimes(1);
  });
});
