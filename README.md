react-sigplot
===============
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md#pull-requests) [![npm version](https://badge.fury.io/js/react-sigplot.svg)](https://badge.fury.io/js/react-sigplot)

SigPlot wrapper component for React 19.

Install: `npm install --save react-sigplot`

## What is it?

Provides React components that wrap the [SigPlot](https://github.com/LGSInnovations/sigplot) library. Layer components don't render DOM nodes — they perform imperative canvas operations on the parent `<SigPlot>` plot instance via React Context.

## Requirements

- React 19+
- sigplot ^2.0.0

## Properties

### \<SigPlot />

|Property|Type|Default|Explanation|
|---|---|---|---|
|`height`|`number`|300|Height of the `div` wrapping SigPlot|
|`width`|`number`|300|Width of the `div` wrapping SigPlot|
|`display`|`string`|inline-block|CSS display type for `div` wrapping SigPlot|
|`styles`|`CSSProperties`|`undefined`|any other CSS Styles as JS object|
|`options`|`object`|`{all: true, expand: true, autol: 100, autohide_panbars: true}`|SigPlot `Plot` options|

### \<ArrayLayer />

|Property|Type|Default|Explanation|
|---|---|---|---|
|`data`|`number[] \| number[][] \| ArrayBuffer`|`undefined`|Array of values to plot|
|`options`|`object`|`undefined`|SigPlot data header|
|`layerOptions`|`object`|`undefined`|SigPlot `Layer` options|

### \<PipeLayer />

|Property|Type|Default|Explanation|
|---|---|---|---|
|`data`|`number[] \| ArrayBuffer`|`undefined`|Array of values to plot|
|`options`|`object`|`undefined`|SigPlot `Layer` options|
|`layerOptions`|`object`|`undefined`|SigPlot `Layer` options|

### \<HrefLayer />

|Property|Type|Default|Explanation|
|---|---|---|---|
|`href`|`string`|`''`|URL or path to a bluefile or MATLAB file|
|`onload`|`function`|`null`|Function that will get executed when file is loaded|
|`options`|`object`|`undefined`|SigPlot `Layer` options|

### \<BlueLayer />

|Property|Type|Default|Explanation|
|---|---|---|---|
|`data`|`unknown`|`undefined`|Bluefile header container (HCB)|
|`options`|`object`|`undefined`|SigPlot data header|
|`layerOptions`|`object`|`undefined`|SigPlot `Layer` options|

### \<WebsocketLayer />

|Property|Type|Default|Explanation|
|---|---|---|---|
|`wsurl`|`string`|`''`|URL to the websocket server|
|`overrides`|`object`|`undefined`|SigPlot `Layer` overrides|
|`options`|`object`|`undefined`|SigPlot `Layer` options|

### \<Plugin />

|Property|Type|Default|Explanation|
|---|---|---|---|
|`plugin`|`unknown`|required|A sigplot plugin instance|
|`pluginOptions`|`object`|`undefined`|Plugin options|

### Hooks

- **`usePlot()`** — Returns the parent `Plot` instance from context. Use this in custom layer or plugin components.
- **`SigPlotContext`** — The React context providing the `Plot` instance.

## Usage

### Basic

```tsx
import { SigPlot, ArrayLayer, PipeLayer, HrefLayer } from 'react-sigplot';

function App() {
  const [data, setData] = useState<number[]>([]);

  return (
    <div>
      <SigPlot options={{ autol: 1 }}>
        <ArrayLayer data={data} />
      </SigPlot>
      <SigPlot>
        <PipeLayer
          options={{ type: 2000, subsize: 1000 }}
          data={data}
        />
      </SigPlot>
      <SigPlot>
        <HrefLayer href="/path/to/file.tmp" />
      </SigPlot>
    </div>
  );
}
```

### Custom Layer with usePlot

```tsx
import { useEffect, useRef } from 'react';
import { usePlot } from 'react-sigplot';

function MyCustomLayer({ data }: { data: number[] }) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);

  useEffect(() => {
    layerRef.current = plot.overlay_array(data, {}, {});
    return () => {
      if (layerRef.current !== null) {
        plot.remove_layer(layerRef.current);
      }
    };
  }, []);

  return null;
}
```

## Development

```bash
npm install
npm run dev       # Start Vite dev server with example app
npm test          # Run tests
npm run build     # Build library (ESM + UMD)
npm run typecheck # Type check without emitting
```

## Migrating from 0.x

### Layer base class removed

The `Layer` abstract class has been removed. In 0.x, you could extend `Layer` to create custom layers:

```jsx
// 0.x — no longer supported
import { Layer } from 'react-sigplot';

class MyLayer extends Layer {
  componentDidMount() {
    this.layer = this.plot.overlay_array(this.props.data);
  }
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.plot.reload(this.layer, this.props.data);
    }
  }
}
```

In 1.x, use the `usePlot()` hook in a functional component instead:

```tsx
// 1.x
import { useEffect, useRef } from 'react';
import { usePlot } from 'react-sigplot';

function MyLayer({ data }: { data: number[] }) {
  const plot = usePlot();
  const layerRef = useRef<number | null>(null);

  useEffect(() => {
    layerRef.current = plot.overlay_array(data, {}, {});
    return () => {
      if (layerRef.current !== null) plot.remove_layer(layerRef.current);
    };
  }, []);

  useEffect(() => {
    if (layerRef.current !== null) plot.reload(layerRef.current, data);
  }, [data]);

  return null;
}
```

### Other changes

- **React 19+ required** — legacy context API (`contextTypes`) is no longer supported by React.
- **TypeScript** — all components export named prop types (e.g., `ArrayLayerProps`, `SigPlotProps`).
- **ESM + UMD** — the library is now built with Vite. Import paths are unchanged.

## Example Preview

![React Sigplot](https://raw.githubusercontent.com/spectriclabs/react-sigplot/master/docs/example.gif)
