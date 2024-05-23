import { Listener, EventNames, Key } from './shapes';

export interface Action {
  type: ActionType;
  id: string;
}

export enum ActionType {
  Down = 'DOWN',
  Up = 'Up',
  Move = 'MOVE',
}

export default class EventSimulator {
  private listenersMap: {
    [id: Key]: {
      [eventName: string]: Listener[];
    };
  } = {};

  private lastDownId: string;
  private lastMoveId: string;

  addAction(action: Action, evt: MouseEvent) {
    const { type, id } = action;
    const actionHandleMap = {
      // mousemove
      [ActionType.Move]: () => {
        this.fire(id, EventNames.mousemove, evt);
        // mouseover
        // mouseenter
        if (!this.lastMoveId || this.lastMoveId !== id) {
          this.fire(id, EventNames.mouseenter, evt);
          this.fire(this.lastMoveId, EventNames.mouseleave, evt);
        }
      },
      [ActionType.Down]: () => {
        this.fire(id, EventNames.mousedown, evt);
      },
      [ActionType.Up]: () => {
        this.fire(id, EventNames.mouseup, evt);
        // click
        if (this.lastDownId === id) {
          this.fire(id, EventNames.click, evt);
        }
      },
    }
    actionHandleMap[type]()

    if (type === ActionType.Move) {
      this.lastMoveId = action.id;
    } else if (type === ActionType.Down) {
      this.lastDownId = action.id;
    }
  }

  addListeners(
    id: Key,
    listeners: {
      [eventName: string]: Listener[];
    },
  ) {
    this.listenersMap[id] = listeners;
  }

  fire(id: Key, eventName: EventNames, evt: MouseEvent) {
    if (this.listenersMap[id] && this.listenersMap[id][eventName]) {
      this.listenersMap[id][eventName].forEach((listener) => listener(evt, id));
    }
  }
}
