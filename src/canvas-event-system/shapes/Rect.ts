import { idToRgba } from '../helpers';
import Base from './Base';

interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
}

export default class Rect extends Base {
  constructor(private props: RectProps) {
    super();
    this.props.fillColor = props.fillColor || '#fff';
    this.props.strokeColor = props.strokeColor || '#000';
    this.props.strokeWidth = props.strokeWidth || 1;
  }

  linetoNodeArr: Rect[] = []
  draw(ctx: CanvasRenderingContext2D, osCtx: OffscreenCanvasRenderingContext2D) {
    const { x, y, width, height, strokeColor, strokeWidth, fillColor } = this.props;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = fillColor;
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    const [r, g, b, a] = idToRgba(this.id);

    osCtx.save();
    osCtx.beginPath();
    osCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.rect(x, y, width, height);
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
    // TODO: 完善路径
    const start = { x: 0, y: 0 }
    const end = { x: 0, y: 0 }
    const centerPos = {}
    const nodeCenterPos = {}
    // 如果当前节点在下个节点的上面，则用当前节点的bottom中间的点位连接下个节点top中间的点位
    // 如果当前节点在下个节点的左面，则用当前节点的rigth中间的点位连接下个节点left中间的点位
    // const line = new PathLine({ start, end })
  }
}
