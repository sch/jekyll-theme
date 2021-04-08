<script lang="ts">
  import { onMount } from "svelte";

  import { drawText, emptyCanvas, flipBit } from "./canvas";
  import { randomWalk, Point, Dimensions } from "./graphics";

  let mounted = false;
  let points = [];
  let clientWidth = 10;
  let clientHeight = 10;
  let checkboxWidth = 16;
  let checkboxHeight = 16;
  let sampledDimensions = new Dimensions(10, 10);
  let canvas = emptyCanvas(10, 10);
  let interval;

  $: if (mounted) {
    const containerDimensions = new Dimensions(clientWidth, clientHeight);
    const checkboxDimensions = new Dimensions(checkboxWidth, checkboxHeight);
    sampledDimensions = containerDimensions.sample(checkboxDimensions);
    canvas = emptyCanvas(sampledDimensions.width, sampledDimensions.height);

    if (sampledDimensions.width > 38) {
      canvas = drawText(canvas, "adrian", new Point(2, 2));
      canvas = drawText(canvas, "schaedle", new Point(2, 9));
    }

    points.forEach(point => flipBit(canvas, point.x, point.y));
    points = points;
  }

  onMount(function() {
    interval = setInterval(tick, 1500);

    var el = document.querySelector(".js-Checkboxes");

    if (el && el.classList.contains("isPaused")) {
      el.classList.remove("isPaused");
    }

    mounted = true;

    return function cleanup() {
      clearInterval(interval);
    };
  });

  function tick() {
    points = points.map(point => randomWalk(point, sampledDimensions));
  }

  function addPoint(event) {
    clearInterval(interval)
    const x = parseInt(event.target.dataset.x, 10)
    const y = parseInt(event.target.dataset.y, 10)
    const newPoint = new Point(x, y);
    points = [...points, newPoint];
    interval = setInterval(tick, 1500);
  }
</script>

<style>
  .CheckboxCanvas {
    box-sizing: border-box;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .CheckboxCanvas div {
    margin: 0;
    line-height: 0;
  }

  label.Checkbox {
    padding: 3px 2px;
    display: inline-block;
    overflow: hidden;
  }

  .Checkbox input {
    display: block;
    margin: 0;
    padding: 0;
  }

  .visually-hidden {
    visibility: hidden;
    position: absolute;
  }
</style>

<!-- This element is used to measure the size of a checkbox, so we know how many checkboxes can fit inside the grid -->
<div class="visually-hidden">
  <label
    class="Checkbox"
    bind:clientWidth="{checkboxWidth}"
    bind:clientHeight="{checkboxHeight}"
  >
    <input type="checkbox" />
  </label>
</div>

<div
  bind:clientWidth="{clientWidth}"
  bind:clientHeight="{clientHeight}"
  class="CheckboxCanvas"
>
  {#each canvas as row, y}
  <div>
    {#each row as checked, x}
    <label class="Checkbox">
      <input type="checkbox" {checked} data-x={x} data-y={y} on:change={addPoint} />
    </label>
    {/each}
  </div>
  {/each}
</div>
