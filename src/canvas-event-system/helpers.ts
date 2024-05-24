export function idToRgba(id: string) {
  return id.split("-");
}

export function rgbaToId(rgba: [number, number, number, number]) {
  return rgba.join("-");
}

const idPool = {};

export function createId(): string {
  let id = createOnceId();

  while (idPool[id]) {
    id = createOnceId();
  }

  return id;
}

function createOnceId(): string {
  return Array(3)
    .fill(0)
    .map(() => Math.ceil(Math.random() * 255))
    .concat(255)
    .join("-");
}

/** 统一单位为px */
export function convertToPixels(value: string) {
  if (value.endsWith('px')) {
      return parseInt(value)
  } else if (value.endsWith('vw')) {
      return window.innerWidth * (parseInt(value) / 100)
  } else if (value.endsWith('vh')) {
      return window.innerHeight * (parseInt(value) / 100)
  } else if (value.endsWith('rem')) {
    return parseInt(value) * parseInt(getComputedStyle(document.documentElement).fontSize);
  } else {
      throw new Error('Unsupported unit: ' + value)
  }
}