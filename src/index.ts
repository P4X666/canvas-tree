import { Stage, Rect, Circle, EventNames } from './canvas-event-system';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const stage = new Stage(canvas);

const rect = new Rect({
  x: 50,
  y: 50,
  width: 150,
  height: 100,
  fillColor: 'green',
});

const circle = new Circle({
  x: 200,
  y: 250,
  radius: 50,
  fillColor: 'red',
});

rect.on(EventNames.mousedown, () => console.log('rect mousedown'));
rect.on(EventNames.mouseup, () => console.log('rect mouseup'));
rect.on(EventNames.mouseenter, () => console.log('rect mouseenter'));
rect.on(EventNames.click, () => console.log('rect click'));

circle.on(EventNames.click, () => console.log('circle click!!'));
circle.on(EventNames.mouseleave, () => console.log('circle mouseleave!'));

stage.add(rect);
stage.add(circle);

// import Scene from './canvas-transform-system/Scene'
// let scene = new Scene(canvas);
// scene.draw();

const zoomInBtn = document.querySelector('#zoomIn') as HTMLButtonElement;
zoomInBtn.addEventListener('click', () => {
  // 放大
  stage.zoomIn();
})

const zoomOutBtn = document.querySelector('#zoomOut') as HTMLButtonElement;
zoomOutBtn.addEventListener('click', () => {
  // 缩小
  stage.zoomOut();
})

const resetBtn = document.querySelector('#reset') as HTMLButtonElement;
resetBtn.addEventListener('click', () => {
  stage.reset();
})
