import { idToRgba } from '../helpers';
import Base from './Base';

interface RectProps {
  x: number;
  y: number;
  radius: number;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
}

export default class Circle extends Base {
  constructor(private props: RectProps) {
    super();
    this.props.fillColor = props.fillColor || '#fff';
    this.props.strokeColor = props.strokeColor || '#000';
    this.props.strokeWidth = props.strokeWidth || 1;
  }

  draw(ctx: CanvasRenderingContext2D, osCtx: OffscreenCanvasRenderingContext2D, scale: number) {
    const { x, y, radius, strokeColor, strokeWidth, fillColor } = this.props;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.arc(x*scale, y*scale, radius*scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    const [r, g, b, a] = idToRgba(this.id);

    osCtx.save();
    osCtx.beginPath();
    osCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.lineWidth = strokeWidth;
    osCtx.arc(x*scale, y*scale, radius*scale, 0, Math.PI * 2);
    osCtx.fill();
    osCtx.stroke();
    osCtx.restore();
  }
}
