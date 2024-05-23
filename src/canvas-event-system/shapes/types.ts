import Base from "./Base";

export type Shape = Base

export interface Listener {
  (evt: MouseEvent, key: string | number): void;
}

export type Key = string | number

export enum EventNames {
  click = 'click',
  mousedown = 'mousedown',
  mousemove = 'mousemove',
  mouseup = 'mouseup',
  mouseenter = 'mouseenter',
  mouseleave = 'mouseleave',
}
