import { idToRgba } from '../helpers';
import Base from './Base';

interface PathProps {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  strokeWidth?: number;
  strokeColor?: string;
}

export default class PathLine extends Base {
  constructor(private props: PathProps) {
    super();
    this.props.strokeColor = props.strokeColor || 'rgba(81, 160, 255,1)';
    this.props.strokeWidth = props.strokeWidth || 1;
  }
  draw(ctx: CanvasRenderingContext2D, osCtx: OffscreenCanvasRenderingContext2D) {
    const { start, end, strokeColor, strokeWidth } = this.props;

    ctx.save();
    // 设置线条样式
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    // 创建路径
    ctx.beginPath()
    // 移动笔触到(100,100)坐标处
    ctx.moveTo(start.x, start.y)
    // 把线连接到(700,700)这个位置
    ctx.lineTo(end.x, end.y)
    // 把刚刚的路径绘制出来
    ctx.stroke()
    ctx.restore();

    const [r, g, b, a] = idToRgba(this.getId());

    osCtx.save();
    // 设置线条样式
    osCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.lineWidth = strokeWidth
    // 创建路径
    osCtx.beginPath()
    // 移动笔触到(100,100)坐标处
    osCtx.moveTo(100, 100)
    // 把线连接到(700,700)这个位置
    osCtx.lineTo(700, 700)
    // 把刚刚的路径绘制出来
    osCtx.stroke()
    osCtx.restore();
  }
}
