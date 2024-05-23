import { rgbaToId } from './helpers';
import { Key, Shape } from './shapes/types';
import EventSimulator, { ActionType } from './EventSimulator';
export * from './shapes';

export class Stage {
  private canvas: HTMLCanvasElement;
  private osCanvas: OffscreenCanvas;
  private ctx: CanvasRenderingContext2D;
  private osCtx: OffscreenCanvasRenderingContext2D;
  private dpr: number;
  private shapes: Set<Key> = new Set();
  private eventSimulator: EventSimulator;

  width: number
  height: number
  mousePosition = { x: 0, y: 0 }; // 记录鼠标滚轮点击时的坐标位置

  maxScale = 8;
  minScale = 0.4;
  scaleStep = 0.06;

  scale: number;
  preScale: number;

  offset = { x: 0, y: 0 }; // 拖动偏移
  curOffset = { x: 0, y: 0 }; // 记录上一次的偏移量

  x = 0; // 记录鼠标点击Canvas时的横坐标
  y = 0; // 记录鼠标点击Canvas时的纵坐标
  private nodes: Shape[] = []; // 记录canvas上面所有的节点

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
    this.width = canvas.width
    this.height = canvas.height

    this.canvas = canvas;
    this.osCanvas = new OffscreenCanvas(canvas.width, canvas.height);

    this.ctx = this.canvas.getContext('2d');
    this.osCtx = this.osCanvas.getContext('2d');

    this.ctx.scale(dpr, dpr);
    this.osCtx.scale(dpr, dpr);
    this.dpr = dpr;
    this.scale = dpr;
    this.preScale = dpr;
  }

  initEventListener() {
    this.canvas.addEventListener('mousedown', this.handleCreator(ActionType.Down));
    this.canvas.addEventListener('mouseup', this.handleCreator(ActionType.Up));
    this.canvas.addEventListener('mousemove', this.handleCreator(ActionType.Move));
    this.canvas.addEventListener('mousewheel', (ev) => this.onMousewheel(ev as WheelEvent));
    this.canvas.addEventListener('mousedown', (ev) => this.onMousedown(ev));
  }

  add(shape: Shape) {
    const id = shape.key || shape.getId();
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
   * 判断鼠标是否在节点上
   * @param x
   * @param y
   */
  private hitJudge(x: number, y: number): string {
    const rgba = Array.from(this.osCtx.getImageData(x * this.dpr, y * this.dpr, 1, 1).data);
    const id = rgbaToId(rgba as [number, number, number, number]);
    return this.shapes.has(id) ? id : undefined;
  }

  onMousewheel(e: WheelEvent) {
    e.preventDefault();

    this.mousePosition.x = e.offsetX; // 记录当前鼠标点击的横坐标
    this.mousePosition.y = e.offsetY; // 记录当前鼠标点击的纵坐标
    if (e.deltaY < 0) {
      // 放大
      this.scale = parseFloat((this.scaleStep + this.scale).toFixed(2));
      if (this.scale > this.maxScale) {
        this.scale = this.maxScale;
        return;
      }
    } else {
      // 缩小
      this.scale = parseFloat((this.scale - this.scaleStep).toFixed(2));
      if (this.scale < this.minScale) {
        this.scale = this.minScale;
        return;
      }
    }

    this.zoom();
  }
  zoom() {
    this.offset.x = this.mousePosition.x - (this.mousePosition.x - this.offset.x) * this.scale / this.preScale;
    this.offset.y = this.mousePosition.y - (this.mousePosition.y - this.offset.y) * this.scale / this.preScale;

    this.paint();
    this.preScale = this.scale;
    this.curOffset.x = this.offset.x;
    this.curOffset.y = this.offset.y;
  }
  clear() {
    this.canvas.width = this.width;
    this.osCtx.canvas.width = this.width
  }

  paint() {
    this.clear();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.osCtx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);
    this.osCtx.scale(this.scale, this.scale);
    this.draw();
  }
  zoomIn() {
    this.scale = parseFloat((this.scaleStep + this.scale).toFixed(2))

    if (this.scale > this.maxScale) {
      this.scale = this.maxScale;
      return;
    }
    this.mousePosition.x = this.width / 2;
    this.mousePosition.y = this.height / 2;
    this.zoom();
  }

  zoomOut() {
    this.scale = parseFloat((this.scale - this.scaleStep).toFixed(2));
    if (this.scale < this.minScale) {
      this.scale = this.minScale;
      return;
    }
    this.mousePosition.x = this.width / 2;
    this.mousePosition.y = this.height / 2;
    this.zoom();
  }

  onMousedown(e: MouseEvent) {

    if (e.button === 0) {
      // 鼠标左键
      this.x = e.x;
      this.y = e.y

      window.addEventListener('mousemove', this.onMousemove);
      window.addEventListener('mouseup', this.onMouseup)
    }
  }

  onMousemove = (e: MouseEvent) => {
    this.offset.x = this.curOffset.x + (e.x - this.x);
    this.offset.y = this.curOffset.y + (e.y - this.y);

    this.paint();
  }

  onMouseup = () => {
    this.curOffset.x = this.offset.x;
    this.curOffset.y = this.offset.y;
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
  }

  reset() {
    this.clear();
    this.scale = this.dpr; // 默认缩放
    this.preScale = this.dpr; // 上一次缩放
    this.offset = { x: 0, y: 0 }; // 拖动偏移
    this.curOffset = { x: 0, y: 0 }; // 当前偏移
    this.mousePosition = { x: 0, y: 0 };
    this.draw();
  };
}
