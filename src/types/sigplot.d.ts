declare module 'sigplot' {
  interface PlotLayer {
    change_settings(options: Record<string, unknown>): void;
    options: Record<string, unknown>;
    ypoint: Float64Array | null;
    hcb: Record<string, unknown>;
    size: number;
    drawmode: string | undefined;
  }

  interface PlotGx {
    all: boolean;
    expand: boolean;
    autol: number;
    autohide_panbars: boolean;
    lyr: PlotLayer[];
  }

  export class Plot {
    _Gx: PlotGx;

    constructor(element: HTMLElement, options?: Record<string, unknown>);
    checkresize(): void;
    change_settings(options: Record<string, unknown>): void;
    overlay_array(
      data: number[] | number[][] | ArrayBuffer | undefined,
      options?: Record<string, unknown>,
      layerOptions?: Record<string, unknown>
    ): number;
    overlay_bluefile(
      data: unknown,
      layerOptions?: Record<string, unknown>
    ): number;
    overlay_pipe(
      options?: Record<string, unknown>,
      layerOptions?: Record<string, unknown>
    ): number;
    overlay_href(
      href: string,
      onload?: ((hcb: unknown) => void) | null,
      options?: Record<string, unknown>
    ): number;
    overlay_websocket(
      wsurl: string,
      overrides?: Record<string, unknown>,
      options?: Record<string, unknown>
    ): number;
    overlay_wpipe(
      wsurl: string,
      options?: Record<string, unknown>,
      layerOptions?: Record<string, unknown>,
      fps?: number
    ): number;
    push(
      layer: number,
      data: number[] | ArrayBuffer,
      options?: Record<string, unknown>
    ): void;
    reload(
      layer: number,
      data: number[] | number[][] | ArrayBuffer | undefined,
      options?: Record<string, unknown>
    ): void;
    headermod(layer: number, options?: Record<string, unknown>): void;
    remove_layer(layer: number): void;
    delete_layer(layer: number): void;
    deoverlay(layer: number): void;
    get_layer(layer: number): PlotLayer;
    add_plugin(plugin: unknown, options?: Record<string, unknown>): void;
    remove_plugin(plugin: unknown): void;
  }
}
