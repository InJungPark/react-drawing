const canvas = document.querySelector("canvas"); // canvas = html element
const ctx = canvas.getContext("2d"); // ctx = context -> 2d = 2 dimensions

canvas.width = 800;
canvas.height = 800;

ctx.fillRect(50, 50, 100, 200);
