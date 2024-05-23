import { EventNames, Key, Listener } from './types';
import { createId } from '../helpers';

export default class Base {
  private listeners: { [eventName: string]: Listener[] };
  /** 内部使用 */
  private id: string;

  /** 外部区分节点 */
  public key: Key
  constructor() {
    this.id = createId();
    this.listeners = {};
  }

  draw(ctx: CanvasRenderingContext2D, osCtx: OffscreenCanvasRenderingContext2D): void {
    throw new Error('Method not implemented.');
  }

  on(eventName: EventNames, listener: Listener): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName].push(listener);
    } else {
      this.listeners[eventName] = [listener];
    }
  }

  getListeners(): { [name: string]: Listener[] } {
    return this.listeners;
  }

  getId(): string {
    return this.id;
  }
}
