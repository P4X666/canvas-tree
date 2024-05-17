import { rgbaToId } from './helpers';
import { Shape } from './shapes/types';
import EventSimulator, { ActionType } from './EventSimulator';
export * from './shapes';

export class Stage {
  private canvas: HTMLCanvasElement;
  private osCanvas: OffscreenCanvas;
  private ctx: CanvasRenderingContext2D;
  private osCtx: OffscreenCanvasRenderingContext2D;
  private dpr: number;
  private shapes: Set<string> = new Set();
  private eventSimulator: EventSimulator;

  private nodes: Shape[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
    this.initEventListener()
    this.eventSimulator = new EventSimulator();

  }

  init(canvas: HTMLCanvasElement) {
    // 高清屏适配
    const dpr = window.devicePixelRatio;
    canvas.width = parseInt(canvas.style.width) * dpr;
    canvas.height = parseInt(canvas.style.height) * dpr;
    this.canvas = canvas;
    this.osCanvas = new OffscreenCanvas(canvas.width, canvas.height);

    this.ctx = this.canvas.getContext('2d');
    this.osCtx = this.osCanvas.getContext('2d');

    this.ctx.scale(dpr, dpr);
    this.osCtx.scale(dpr, dpr);
    this.dpr = dpr;
  }

  initEventListener() {
    this.canvas.addEventListener('mousedown', this.handleCreator(ActionType.Down));
    this.canvas.addEventListener('mouseup', this.handleCreator(ActionType.Up));
    this.canvas.addEventListener('mousemove', this.handleCreator(ActionType.Move));
  }

  add(shape: Shape) {
    const id = shape.getId();
    this.eventSimulator.addListeners(id, shape.getListeners());
    this.shapes.add(id);

    this.nodes.push(shape)
    this.draw(shape)
  }

  draw(shape?: Shape) {
    if (shape) {
      shape.draw(this.ctx, this.osCtx);
      return
    }
    for (const shape of this.nodes) {
      shape.draw(this.ctx, this.osCtx);
    }
  }

  private handleCreator = (type: ActionType) => (evt: MouseEvent) => {
    const x = evt.offsetX;
    const y = evt.offsetY;
    const id = this.hitJudge(x, y);
    this.eventSimulator.addAction({ type, id }, evt);
  };

  /**
   * Determine whether the current position is inside a certain shape, if it is, then return its id
   * @param x
   * @param y
   */
  private hitJudge(x: number, y: number): string {
    const rgba = Array.from(this.osCtx.getImageData(x * this.dpr, y * this.dpr, 1, 1).data);

    const id = rgbaToId(rgba as [number, number, number, number]);
    return this.shapes.has(id) ? id : undefined;
  }
}
