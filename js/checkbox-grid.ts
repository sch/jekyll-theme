import { drawText, emptyCanvas, flipBit } from "./canvas";
import { Dimensions, Point, randomWalk } from "./graphics";

/**
 * To be instantiated as a <checkbox-grid> element
 */
export class CheckboxGrid extends HTMLElement {
  private canvas = document.createElement("div");
  private sample = document.createElement("label");
  private inputs: HTMLInputElement[][] = [];
  private points: Point[] = [];
  private dimensions = new Dimensions(0, 0);
  private observer = new ResizeObserver(this.resize.bind(this));
  private interval: ReturnType<typeof setInterval> | undefined;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; overflow: hidden; }
      .canvas { box-sizing: border-box; overflow: hidden; width: 100%; height: 100%; }
      .canvas > div { margin: 0; line-height: 0; white-space: nowrap; }
      label { padding: 3px 2px; display: inline-block; overflow: hidden; }
      input { display: block; margin: 0; padding: 0; }
      .sample { visibility: hidden; position: absolute; pointer-events: none; }
    `;
    this.canvas.className = "canvas";
    this.sample.className = "sample";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.tabIndex = -1;
    this.sample.setAttribute("aria-hidden", "true");
    this.sample.appendChild(input);
    shadow.append(style, this.sample, this.canvas);
  }

  connectedCallback() {
    this.canvas.addEventListener("change", this);
    this.observer.observe(this.canvas);
    this.observer.observe(this.sample);
    this.resize();
    this.restartTimer();
  }

  disconnectedCallback() {
    this.observer.disconnect();
    clearInterval(this.interval);
    this.canvas.removeEventListener("change", this);
  }

  // handle clicks on the checkboxes
  handleEvent(event: Event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    this.points = [
      ...this.points,
      new Point(Number(input.dataset.x), Number(input.dataset.y)),
    ];
    this.render();
    this.restartTimer();
  }

  private resize() {
    if (
      !this.isConnected ||
      !this.sample.clientWidth ||
      !this.sample.clientHeight
    )
      return;
    const dimensions = new Dimensions(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
    ).sample(new Dimensions(this.sample.clientWidth, this.sample.clientHeight));
    if (
      dimensions.width === this.dimensions.width &&
      dimensions.height === this.dimensions.height
    )
      return;
    this.dimensions = dimensions;
    this.reconcileInputs();
    this.render();
    this.classList.remove("isPaused");
  }

  private tick() {
    this.points = this.points.map((point) =>
      randomWalk(point, this.dimensions),
    );
    this.render();
  }

  private restartTimer() {
    clearInterval(this.interval);
    this.interval = setInterval(this.tick.bind(this), 1500);
  }

  private render() {
    let bitmap = emptyCanvas(this.dimensions.width, this.dimensions.height);
    if (this.dimensions.width > 38) {
      bitmap = drawText(bitmap, "adrian", new Point(2, 2));
      bitmap = drawText(bitmap, "schaedle", new Point(2, 9));
    }
    this.points.forEach((point) => flipBit(bitmap, point.x, point.y));
    this.inputs.forEach((row, y) =>
      row.forEach((input, x) => {
        input.checked = bitmap[y][x];
      }),
    );
  }

  // Rebuild the grid on resize
  private reconcileInputs() {
    while (this.inputs.length > this.dimensions.height) {
      this.canvas.lastElementChild!.remove();
      this.inputs.pop();
    }
    for (let y = 0; y < this.dimensions.height; y++) {
      if (!this.inputs[y]) {
        this.inputs.push([]);
        this.canvas.appendChild(document.createElement("div"));
      }
      const row = this.inputs[y];
      const element = this.canvas.children[y];
      while (row.length > this.dimensions.width) {
        element.lastElementChild!.remove();
        row.pop();
      }
      while (row.length < this.dimensions.width) {
        const x = row.length;
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.dataset.x = String(x);
        input.dataset.y = String(y);
        input.setAttribute("aria-label", `Column ${x + 1}, row ${y + 1}`);
        label.appendChild(input);
        element.appendChild(label);
        row.push(input);
      }
    }
  }
}
