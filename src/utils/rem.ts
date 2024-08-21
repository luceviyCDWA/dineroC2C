import useLayoutStore from "@/store/useLayoutStore";

const baseSize = 37.5;

function setRem() {
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  const isHorizontal = clientWidth / clientHeight > 1.1;
  const { setIsHorizontal } = useLayoutStore.getState();

  // 设计稿一般都是以375的宽度
  const scale = isHorizontal ? 1 : clientWidth / (baseSize * 10);
  
  document.documentElement.style.fontSize = baseSize * scale + "px";
  setIsHorizontal(isHorizontal);
}

setRem();

// 监听窗口在变化时重新设置跟文件大小
window.onresize = function () {
  setRem()
}
