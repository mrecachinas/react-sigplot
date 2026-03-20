import 'vitest-canvas-mock';

// sigplot's mx.set_font uses a do-while loop that keeps increasing font size
// until measureText('M').width >= target width. The default canvas mock returns
// { width: 0 } from measureText, causing an infinite loop. Patch it to return
// a width proportional to the font size.
const origGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (
  this: HTMLCanvasElement,
  type: string,
  ...args: unknown[]
) {
  // biome-ignore lint/suspicious/noExplicitAny: forwarding to native getContext
  const ctx = (origGetContext as any).call(this, type, ...args);
  if (ctx && type === '2d') {
    let currentFontSize = 10;
    const originalMeasureText = ctx.measureText;
    ctx.measureText = (text: string) => {
      const result = originalMeasureText?.call(ctx, text) ?? {};
      return {
        ...result,
        width: currentFontSize * 0.6 * (text?.length || 1),
      };
    };
    // Track font size changes via a simple setter
    let _font = ctx.font || '';
    try {
      Object.defineProperty(ctx, 'font', {
        get() {
          return _font;
        },
        set(value: string) {
          _font = value;
          const match = String(value).match(/(\d+)px/);
          if (match) {
            currentFontSize = parseInt(match[1], 10);
          }
        },
        configurable: true,
        enumerable: true,
      });
    } catch {
      // If we can't override font, at least ensure measureText works
    }
  }
  return ctx;
} as typeof origGetContext;

window.alert = (msg: string) => {
  console.log(msg);
};
