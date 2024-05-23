import { idToRgba } from '../helpers';
import Base from './Base';

interface PathProps {
  start: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
  };
  end: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
  };
  strokeWidth?: number;
  strokeColor?: string;
}

/** 线段的起始点坐标 */
type LinePos = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export default class PathLine extends Base {
  constructor(private props: PathProps) {
    super();
    this.props.strokeColor = props.strokeColor || 'rgba(81, 160, 255,1)';
    this.props.strokeWidth = props.strokeWidth || 1;
  }

  /** 连接点位置的处理 */
  connectingPoints(start: PathProps['start'], end: PathProps['end']): LinePos|void {
    // 目前只处理矩形容器
    if(start.type !== 'rect' || end.type !== 'rect') return
    const location = {
      /** 是否在正上方 */
      top: 0,
      /** 是否在正下方 */
      bottom: 0,
      /** 是否在正左方 */
      left: 0,
      /** 是否在正右方 */
      right: 0
    }
    if (start.x === end.x) {
      if (start.y<end.y) {
        // start 在 end 的上方
        location.top=1
      } else if (start.y>end.y) {
        // start 在 end 的下方
        location.bottom=1
      } else {
        // start和end的中心点重合，不会连线
      }
    } else if (start.x > end.x) {
      // start 在 end 的右方
      location.right=1
      if (start.y<end.y) {
        // start 在 end 的上方
        location.top=1
      } else if (start.y>end.y) {
        // start 在 end 的下方
        location.bottom=1
      } else {
        
      }
    } else {
      // start 在 end 的左方
      location.left=1
      if (start.y<end.y) {
        // start 在 end 的上方
        location.top=1
      } else if (start.y>end.y) {
        // start 在 end 的下方
        location.bottom=1
      } else {

      }
    }
    // start 在 end 的正上方
    if (location.top===1 && location.bottom===0 && location.left===0 && location.right===0) {
      return {startX: start.x, startY: start.y+start.height/2, endX: end.x, endY: end.y-end.height/2}
    }
    // start 在 end 的正下方
    if (location.top===0 && location.bottom===1 && location.left===0 && location.right===0) {
      return {startX: start.x, startY: start.y-start.height/2, endX: end.x, endY: end.y+end.height/2}
    }
    // start 在 end 的左方
    if (location.top===0 && location.bottom===0 && location.left===1 && location.right===0) {
      return {startX: start.x + start.width/2, startY: start.y, endX: end.x-end.width/2, endY: end.y}
    }
    // start 在 end 的右方
    if (location.top===0 && location.bottom===0 && location.left===0 && location.right===1) {
      return {startX: start.x - start.width/2, startY: start.y, endX: end.x+end.width/2, endY: end.y}
    }
  }
  /** 绘制箭头 */
  drawArrow(ctx: CanvasRenderingContext2D, linePos: LinePos) {
    const { startX, startY, endX, endY} = linePos
    const arrowSize = 10;
    const angle = Math.PI / 6;
    const dx = endX - startX;
    const dy = endY - startY;
    const tip1_x = endX - arrowSize * Math.cos(angle + Math.atan2(dy, dx));
    const tip1_y = endY - arrowSize * Math.sin(angle + Math.atan2(dy, dx));
    const tip2_x = endX - arrowSize * Math.cos(-angle + Math.atan2(dy, dx));
    const tip2_y = endY - arrowSize * Math.sin(-angle + Math.atan2(dy, dx));
    ctx.moveTo(endX, endY);
    ctx.lineTo(tip1_x, tip1_y);
    ctx.moveTo(endX, endY);
    ctx.lineTo(tip2_x, tip2_y);
  }
  draw(ctx: CanvasRenderingContext2D, osCtx: OffscreenCanvasRenderingContext2D) {
    const { start, end, strokeColor, strokeWidth } = this.props;

    const pos = this.connectingPoints(start, end)
    if(!pos) return
    const { startX, startY, endX, endY} = pos

    ctx.save();
    // 设置线条样式
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.beginPath()
    /** 绘制连线 */
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)

    /** 绘制箭头 */
    this.drawArrow(ctx, pos)

    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor;
    
    ctx.stroke()
    ctx.restore();

    const [r, g, b, a] = idToRgba(this.getId());

    osCtx.save();
    // 设置线条样式
    osCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    osCtx.lineWidth = strokeWidth
    osCtx.beginPath()
    osCtx.moveTo(startX, startY)
    osCtx.lineTo(endX, endY)
    // 把刚刚的路径绘制出来
    osCtx.stroke()
    osCtx.restore();
  }
}
