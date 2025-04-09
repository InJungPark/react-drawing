const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas"); // canvas = html element
const ctx = canvas.getContext("2d"); // ctx = context -> 2d = 2 dimensions

// ctx.fillRect(0, 0, 800, 800); 중복으로 많이 쓰이니 상수로 만들기
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
// canvas.width = 800;
// canvas.height = 800;
ctx.lineWidth = lineWidth.value;

let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

// Fill 동작
function onCanvasClick() {
  if (isFilling) {
    // ctx.fillRect(0, 0, 800, 800);
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

// 초기화 동작
function OnDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// erase 기능 활성화
function onEraserClick() {
  ctx.strokeStyle = "white";
  // fill 모드일때 erase를 선택하면, 다시 그리기 모드로 바꿔줌
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  // console.dir(event.target); // input 확인해보기
  const file = event.target.files[0]; // 1. 자바스크립트를 이용하여 업로드한 파일을 가져오고
  const url = URL.createObjectURL(file); // 2. 그 파일을 가리키는 URL을 얻고
  // console.log(url); // 3. 그 URL을 콘솔에 띄우기
  const image = new Image(); // 4. 이미지를 만들기 === html에서 <img src=""/> 로 쓰이는것 과 같음
  image.src = url; // 5. 브라우저의 메모리를 가리키는 URL을 넣어주기
  image.onload = function () {
    // 6. drawimage()라는 ctx.method 호출하기
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // 이미지 크기를 CANVAS_WIDTH CANVAS_HEIGHT로 입력함으로써 캔버스 크기에 사진을 꽉 채우기
    // 7.이미지를 그릴때 file input을 비우기
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save(); // ctx의 현재상태, 색상, 스타일 등 모든 것을 "저장함-1"

    // console.log(event.offsetX, event.offsetY); // 마우스가 클릭한 canvas 내부좌표
    ctx.lineWidth = 1; // text가 잘보이게(숫자가 lineWidth가 크면 stroke된 글자가 잘안보인다) "수정-2"
    ctx.font = "48px serif";

    //stroke or fill
    // ctx.strokeText(text, event.offsetX, event.offsetY);
    // 다시 text를 넣기 전에 lineWidth로 돌아가기(이전 상태를 저장하고, 몇가지 변경 후 다시 저장된 이전 상태로 돌아가기) -> ctx.save();
    ctx.fillText(text, event.offsetX, event.offsetY);

    ctx.restore(); // "수정 완료후 이전에 저장된 상태로 돌아가기-3"
    // 즉, save와 restore 사이에서는 어떤 수정을 하던 저장되지 않고, restore를 하면 이전 상태로 돌아감
  }
}

// 현재 캔버스안에 있는 이미지 저장하기
function onSaveClick() {
  // console.log(canvas.toDataURL());
  const url = canvas.toDataURL();
  // <a href=""/> jvs 버전으로 아래에 입력
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
// canvas.onmousemove = onMove; 아래 addEvent방법과 같음
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

// 컬러를 클릭할떄마다 호출 될 함수
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", OnDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
