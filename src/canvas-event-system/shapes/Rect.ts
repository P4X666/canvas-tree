import { idToRgba } from '../helpers';
import Base from './Base';
import PathLine from './PathLine';

interface RectProps {
  key?: string | number;
  x: number;
  y: number;
  width: number | 'auto';
  height: number;
  /** 盒子的padding */
  padding?: [number, number];
  /*** 线条的宽度 */
  strokeWidth?: number;
  /*** 线条的颜色 */
  strokeColor?: string;
  /*** 盒子的填充色 */
  fillColor?: string;
  /*** 盒子中的文本 */
  content?: string;
  /*** 文本的font */
  font?: string;
  /*** 文本的填充色 */
  fillStyle?: string;
}

export default class Rect extends Base {
  private detail = {
    type: 'rect',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    text: ''
  }

  ctx: CanvasRenderingContext2D
  osCtx: OffscreenCanvasRenderingContext2D

  getDetail() {
    return this.detail
  }
  constructor(private props: RectProps) {
    super();
    this.props.fillColor = props.fillColor || '#fff';
    this.props.strokeColor = props.strokeColor || '#000';
    this.props.strokeWidth = props.strokeWidth || 1;
    this.props.fillStyle = props.fillStyle || '#000';
    this.props.font = props.font || 'italic 14px sans-serif';
    this.props.padding = props.padding || [24, 16]
  }
  linetoNodeArr: Rect[] = []
  fillContent(ctx: CanvasRenderingContext2D, content?: string, x?: number, y?: number) {
    if (!content) return
    ctx.fillStyle = this.props.fillStyle
    ctx.font = this.props.font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(content, x, y)
  }
  getTextInfo(ctx: CanvasRenderingContext2D, text: string) {
    return ctx.measureText(text)
  }
  draw(ctx: CanvasRenderingContext2D, osCtx: OffscreenCanvasRenderingContext2D) {
    const { x, y, width, height, strokeColor, strokeWidth, fillColor, content } = this.props;

    // 根据文本自适应宽度
    let _width: number = width as number
    if (width === 'auto' && content) {
      const textInfo = this.getTextInfo(ctx, content)
      _width = textInfo.width + this.props.padding[0]
    }

    this.detail = { ...this.detail, x, y, width: _width, height, text: content }

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = fillColor;
    ctx.rect(x, y, _width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    this.fillContent(ctx, content, x + _width / 2, y + height / 2)

    const [r, g, b, a] = idToRgba(this.getId());

    osCtx.save();
    osCtx.beginPath();
    osCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.rect(x, y, _width, height);
    osCtx.fill();
    osCtx.stroke();
    osCtx.restore();

    this.ctx = ctx
    this.osCtx = osCtx

    this.renderLine()
  }
  renderLine() {
    const nodes = this.linetoNodeArr
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      this.addLineTo(node, true)
    }
  }
  /** 获取容器中心点坐标 */
  getCenterPos(nodeDetail: typeof this.detail) {
    const { x, y, width, height, type } = nodeDetail;
    return { x: x + width / 2, y: y + height / 2, width, height, type }
  }
  addLineTo(node: Rect, isRender = false) {
    if (!isRender) {
      this.linetoNodeArr.push(node)
    }

    const centerPos = this.getCenterPos(this.detail)
    const nodeCenterPos = this.getCenterPos(node.detail)
    const line = new PathLine({ start: centerPos, end: nodeCenterPos })

    line.draw(this.ctx, this.osCtx)
  }
}
