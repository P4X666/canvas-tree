import { Stage, Rect, Circle, EventNames } from './canvas-event-system';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const stage = new Stage(canvas);


const rectArr: Rect[] = []
for (let i = 0; i < 5; i++) {
  const rect = new Rect({
    x: 50,
    y: 50 + i * 150,
    width: 100,
    height: 80,
    fillColor: 'green',
    content: '绿盒子' + i
  });
  rect.on(EventNames.mousedown, () => console.log('rect mousedown', i));
  rect.on(EventNames.mouseup, () => console.log('rect mouseup', i));
  rect.on(EventNames.mouseenter, () => console.log('rect mouseenter', i));
  rect.on(EventNames.click, () => console.log('rect click', i));
  stage.add(rect);
  rectArr.push(rect)
}
for (let i = 0; i < rectArr.length - 1; i++) {
  const rect = rectArr[i];
  rect.addLineTo(rectArr[i + 1])
}
// const circle = new Circle({
//   x: 200,
//   y: 250,
//   radius: 50,
//   fillColor: 'red',
// });



// circle.on(EventNames.click, () => console.log('circle click!!'));
// circle.on(EventNames.mouseleave, () => console.log('circle mouseleave!'));


// stage.add(circle);

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
