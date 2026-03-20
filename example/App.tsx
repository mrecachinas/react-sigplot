import { useEffect, useState } from 'react';
import { ArrayLayer, HrefLayer, PipeLayer, SigPlot } from '../src';

export default function App() {
  const [rasterData, setRasterData] = useState<number[]>([]);
  const [rasterData2D, setRasterData2D] = useState<number[][]>([]);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const href = 'http://sigplot.lgsinnovations.com/dat/penny.prm';

  useEffect(() => {
    const interval = setInterval(() => {
      const random: number[] = [];
      const random2D: number[][] = [];
      for (let i = 0; i < 1000; i += 1) {
        random.push(Math.random());
        const tmp: number[] = [];
        for (let j = 0; j < 100; j += 1) {
          tmp.push(Math.random());
        }
        random2D.push(tmp);
      }
      setRasterData(random);
      setRasterData2D(random2D);
      setWidth((w) => (w > 350 ? w : w + 1));
      setHeight((h) => (h < 200 ? h : h - 1));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <SigPlot options={{ autol: 1 }} height={height}>
        <ArrayLayer data={rasterData} />
      </SigPlot>
      <SigPlot>
        <ArrayLayer
          options={{ type: 2000, subsize: 100 }}
          data={rasterData2D}
        />
      </SigPlot>
      <SigPlot>
        <PipeLayer options={{ type: 2000, subsize: 1000 }} data={rasterData} />
      </SigPlot>
      <SigPlot width={width}>
        <HrefLayer href={href} />
      </SigPlot>
    </div>
  );
}
