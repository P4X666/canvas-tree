import { idToRgba } from '../helpers';
import Base from './Base';
import PathLine from './PathLine';

interface RectProps {
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

    this.renderLine()
  }
  renderLine() {
    const nodes = this.linetoNodeArr
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      this.addLineTo(node)
    }
  }
  addLineTo(node: Rect) {
    this.linetoNodeArr.push(node)

    const start = { x: 0, y: 0 }
    const end = { x: 0, y: 0 }
    const centerPos = {}
    const nodeCenterPos = {}
    // 如果当前节点在下个节点的上面，则用当前节点的bottom中间的点位连接下个节点top中间的点位
    // 如果当前节点在下个节点的左面，则用当前节点的rigth中间的点位连接下个节点left中间的点位
    // const line = new PathLine({ start, end })
  }
}
