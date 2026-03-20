import { render } from '@testing-library/react';
import { Plot } from 'sigplot';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ArrayLayer from '../src/ArrayLayer';
import HrefLayer from '../src/HrefLayer';
import PipeLayer from '../src/PipeLayer';
import SigPlot from '../src/SigPlot';
import { usePlot } from '../src/SigPlotContext';

// Helper component to capture the Plot instance from context
let capturedPlot: Plot | null = null;
function PlotCapture() {
  capturedPlot = usePlot();
  return null;
}

describe('<SigPlot />', () => {
  afterEach(() => {
    capturedPlot = null;
    vi.restoreAllMocks();
  });

  it('renders with no child layer', () => {
    const { container } = render(
      <SigPlot>
        <PlotCapture />
      </SigPlot>,
    );
    const div = container.firstElementChild as HTMLDivElement;
    expect(div.style.width).toBe('300px');
    expect(div.style.height).toBe('300px');
    expect(div.style.display).toBe('inline-block');
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.all).toBe(true);
    expect(capturedPlot?._Gx.expand).toBe(true);
    expect(capturedPlot?._Gx.autol).toBe(100);
    expect(capturedPlot?._Gx.autohide_panbars).toBe(true);
    expect(capturedPlot?._Gx.lyr).toHaveLength(0);
  });

  it('renders with no child layer with custom height and width', () => {
    const { container } = render(
      <SigPlot height={500} width={800}>
        <PlotCapture />
      </SigPlot>,
    );
    const div = container.firstElementChild as HTMLDivElement;
    expect(div.style.width).toBe('800px');
    expect(div.style.height).toBe('500px');
    expect(div.style.display).toBe('inline-block');
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.all).toBe(true);
    expect(capturedPlot?._Gx.expand).toBe(true);
    expect(capturedPlot?._Gx.autol).toBe(100);
    expect(capturedPlot?._Gx.autohide_panbars).toBe(true);
    expect(capturedPlot?._Gx.lyr).toHaveLength(0);
  });

  it('handles changing custom height and width', () => {
    const { container, rerender } = render(
      <SigPlot height={500} width={800}>
        <PlotCapture />
      </SigPlot>,
    );
    const div = container.firstElementChild as HTMLDivElement;
    expect(div.style.width).toBe('800px');
    expect(div.style.height).toBe('500px');

    const checkresizeSpy = vi.spyOn(Plot.prototype, 'checkresize');

    rerender(
      <SigPlot height={200} width={800}>
        <PlotCapture />
      </SigPlot>,
    );
    expect(div.style.height).toBe('200px');
    expect(div.style.width).toBe('800px');
    expect(checkresizeSpy).toHaveBeenCalledTimes(1);

    rerender(
      <SigPlot height={200} width={100}>
        <PlotCapture />
      </SigPlot>,
    );
    expect(div.style.width).toBe('100px');
    expect(div.style.height).toBe('200px');
    expect(checkresizeSpy).toHaveBeenCalledTimes(2);
  });

  it('handles changing plot options', () => {
    const options = {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true,
    };
    const { rerender } = render(
      <SigPlot options={options}>
        <PlotCapture />
      </SigPlot>,
    );
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.all).toBe(true);
    expect(capturedPlot?._Gx.expand).toBe(true);
    expect(capturedPlot?._Gx.autol).toBe(100);
    expect(capturedPlot?._Gx.autohide_panbars).toBe(true);

    const newOptions = {
      all: false,
      autol: 200,
    };
    rerender(
      <SigPlot options={newOptions}>
        <PlotCapture />
      </SigPlot>,
    );
    expect(capturedPlot?._Gx.all).toBe(false);
    expect(capturedPlot?._Gx.autol).toBe(200);
  });

  it('renders with no child layer with custom options and custom height and width', () => {
    const options = {
      all: false,
      expand: false,
      autol: 1,
      autohide_panbars: false,
    };
    const { container } = render(
      <SigPlot height={500} width={800} options={options}>
        <PlotCapture />
      </SigPlot>,
    );
    const div = container.firstElementChild as HTMLDivElement;
    expect(div.style.width).toBe('800px');
    expect(div.style.height).toBe('500px');
    expect(div.style.display).toBe('inline-block');
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.all).toBe(false);
    expect(capturedPlot?._Gx.expand).toBe(false);
    expect(capturedPlot?._Gx.autol).toBe(1);
    expect(capturedPlot?._Gx.autohide_panbars).toBe(false);
    expect(capturedPlot?._Gx.lyr).toHaveLength(0);
  });

  it('renders with 1D ArrayLayer with no data', () => {
    const options = {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true,
    };
    const oneDimensionalData: number[] = [];
    render(
      <SigPlot options={options}>
        <PlotCapture />
        <ArrayLayer data={oneDimensionalData} />
      </SigPlot>,
    );
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.all).toBe(true);
    expect(capturedPlot?._Gx.expand).toBe(true);
    expect(capturedPlot?._Gx.autol).toBe(100);
    expect(capturedPlot?._Gx.autohide_panbars).toBe(true);
    expect(capturedPlot?._Gx.lyr).toHaveLength(1);
    expect(capturedPlot?._Gx.lyr[0].ypoint).toBeNull();
  });

  it('renders with 2 1D ArrayLayers with no data', () => {
    const options = {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true,
    };
    render(
      <SigPlot options={options}>
        <PlotCapture />
        <ArrayLayer data={[]} />
        <ArrayLayer data={[]} />
      </SigPlot>,
    );
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.lyr).toHaveLength(2);
    expect(capturedPlot?._Gx.lyr[0].ypoint).toBeNull();
    expect(capturedPlot?._Gx.lyr[1].ypoint).toBeNull();
  });

  it('renders with 1D ArrayLayer with data', () => {
    const options = {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true,
    };
    const random: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random.push(i * 10);
    }
    render(
      <SigPlot options={options}>
        <PlotCapture />
        <ArrayLayer data={random} />
      </SigPlot>,
    );
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.lyr).toHaveLength(1);
    expect(capturedPlot?._Gx.lyr[0].ypoint).toHaveLength(random.length);
    expect(capturedPlot?._Gx.lyr[0].ypoint).toEqual(new Float64Array(random));
  });

  it('renders with 2 1D ArrayLayers with data', () => {
    const options = {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true,
    };

    const random1: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random1.push(10 * i);
    }

    const random2: number[] = [];
    for (let i = 0; i <= 1000; i += 1) {
      random2.push(10 * i);
    }

    render(
      <SigPlot options={options}>
        <PlotCapture />
        <ArrayLayer data={random1} />
        <ArrayLayer data={random2} />
      </SigPlot>,
    );
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.lyr).toHaveLength(2);
    expect(capturedPlot?._Gx.lyr[0].ypoint).toHaveLength(random1.length);
    expect(capturedPlot?._Gx.lyr[0].ypoint).toEqual(new Float64Array(random1));
    expect(capturedPlot?._Gx.lyr[1].ypoint).toHaveLength(random2.length);
    expect(capturedPlot?._Gx.lyr[1].ypoint).toEqual(new Float64Array(random2));
  });

  it('renders with PipeLayer', () => {
    const options = {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true,
    };
    const pipeOptions = { type: 2000, subsize: 1000 };
    render(
      <SigPlot options={options}>
        <PlotCapture />
        <PipeLayer options={pipeOptions} />
      </SigPlot>,
    );
    expect(capturedPlot).not.toBeNull();
    expect(capturedPlot?._Gx.lyr).toHaveLength(1);
    expect(capturedPlot?._Gx.lyr[0].hcb.subsize).toBe(1000);
    expect(capturedPlot?._Gx.lyr[0].hcb.type).toBe(2000);
  });

  it('renders with HrefLayer', () => {
    const overlayHrefSpy = vi
      .spyOn(Plot.prototype, 'overlay_href')
      .mockReturnValue(0);
    const options = {
      all: true,
      expand: true,
      autol: 100,
      autohide_panbars: true,
    };
    render(
      <SigPlot options={options}>
        <PlotCapture />
        <HrefLayer href="dat/penny.prm" />
      </SigPlot>,
    );
    expect(capturedPlot).not.toBeNull();
    expect(overlayHrefSpy).toHaveBeenCalledWith(
      'dat/penny.prm',
      null,
      undefined,
    );
  });
});
