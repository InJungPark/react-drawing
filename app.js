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

// 선 그리기 흐름
function onMove(event) {
  if (isPainting) {
    // console.log("선 그리기 : ", event.offsetX, event.offsetY);
    // ctx.lineTo() = path의 끝점으로 이동하는 것
    ctx.lineTo(event.offsetX, event.offsetY);
    // ctx.stroke() = path를 그리는 것
    ctx.stroke();
    return;
  }
  // ctx.moveTo() = path의 시작점으로 이동하는 것
  ctx.moveTo(event.offsetX, event.offsetY);
}

// 마우스가 클릭했을때 선을 그리기 시작하는 함수
// mousedown = 마우스 버튼을 누르는 것
// mouseup = 마우스 버튼을 떼는 것
// mouseleave = 마우스가 canvas를 벗어나는 것
// mousemove = 마우스가 움직이는 것
function startPainting() {
  // console.log("마우스를 딸깍 눌름");
  isPainting = true;
}

function cancelPainting() {
  // console.log("그리는걸 멈췄어요~");
  isPainting = false;
  // ctx.beginPath() = path를 초기화하는 것
  // ctx.beginPath()를 하지 않으면, path가 계속 이어짐
  ctx.beginPath();
}

// 색상 및 선 굵기 조절에 대한 함수
// 선 굵기 변경
function onLineWidthChange(event) {
  // console.log("선 굵기 어느정도 굴기? : ", event.target.value);
  ctx.lineWidth = event.target.value;
}

// 색상 변경
function onColorChange(event) {
  // console.log("직접 색을 선택해 봅니다 : ", event.target.value);
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  // console.log("선택한 색 말해봐 팔래트 : ", colorValue);
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

// 모드 전환 및 기능 버튼
// fill과 draw 모드 전환
// fill = 색칠하기, draw = 선 그리기
function onModeClick() {
  // if (isFilling) {
  //   isFilling = false;
  //   modeBtn.innerText = "Fill";
  // } else {
  //   isFilling = true;
  //   modeBtn.innerText = "Draw";
  // }
  isFilling = !isFilling;
  console.log("모드를 전환해 봅시다 : ", isFilling ? "Fill" : "Draw");
  modeBtn.innerText = isFilling ? "Draw" : "Fill";
}

// Fill 동작(캔버스 채우기)
function onCanvasClick() {
  if (isFilling) {
    // console.log("캔버스 전체를 채워볼게요");
    // ctx.fillRect() = 사각형을 그리는 것
    // ctx.fillRect(0, 0, 800, 800);
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

// 초기화 동작
function OnDestroyClick() {
  // console.log("캔버스를 초기화 해볼게요");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// 지우개 (erase 기능 활성화)
function onEraserClick() {
  // console.log("지우개를 사용해 볼게요");
  ctx.strokeStyle = "white";
  // fill 모드일때 erase를 선택하면, 다시 그리기 모드로 바꿔줌
  isFilling = false;
  modeBtn.innerText = "Fill";
}

// 이미지 업로드
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
  //console.log("text", text);
  if (text !== "") {
    ctx.save(); // ctx의 현재상태, 색상, 스타일 등 모든 것을 "저장함 -1"

    // console.log(event.offsetX, event.offsetY); // 마우스가 클릭한 canvas 내부좌표
    ctx.lineWidth = 1; // text가 잘보이게(숫자가 lineWidth가 크면 stroke된 글자가 잘안보인다) "수정 -2"
    // 기존 한글이 먹히지 않은 부분을 해결하기 위해 'Noto Sans KR',sans-serif"로 변경
    ctx.font = "48px 'Noto Sans KR',sans-serif";

    //  stroke or fill
    // ctx.strokeText(text, event.offsetX, event.offsetY);
    // 다시 text를 넣기 전에 lineWidth로 돌아가기(이전 상태를 저장하고, 몇가지 변경 후 다시 저장된 이전 상태로 돌아가기) -> ctx.save();
    ctx.fillText(text, event.offsetX, event.offsetY);

    ctx.restore(); // "수정 완료후 이전에 저장된 상태로 돌아가기-3"
    // 즉, save와 restore 사이에서는 어떤 수정을 하던 저장되지 않고, restore를 하면 이전 상태로 돌아감
  }
}

// 현재 캔버스안에 있는 이미지 저장하기
function onSaveClick() {
  // console.log("이미지 저장을 시작해 볼게요 : ", canvas.toDataURL());
  const url = canvas.toDataURL();
  // <a href=""/> jvs 버전으로 아래에 입력
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
  // console.log("이미지 저장을 완료했어요");
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
