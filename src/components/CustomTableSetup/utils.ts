/**
 * 对比两个数组对象是否相同
 * @param {Array} local - 本地储存的数组
 * @param {Array} curr - 当前静态的数组
 * @return {boolean} 返回一个布尔值
 */
export function isEqualObj(local: any, curr: any) {
  const cloneLocal = JSON.parse(JSON.stringify(local));
  const cloneCurr = JSON.parse(JSON.stringify(curr));
  const currPropArr: any = [];
  const localPropArr: any = [];
  cloneLocal.forEach((item: any) => {
    delete item.value;
    delete item.visible;
    delete item.sortable;
    localPropArr.push(item.prop);
  });
  cloneCurr.forEach((item: any) => {
    delete item.value;
    delete item.visible;
    delete item.sortable;
    currPropArr.push(item.prop);
  });
  // 如果prop的数组长度不一致，说明有变化
  if (currPropArr.length !== localPropArr.length) {
    return false;
  }
  // 如果prop的数组长度相同，判断两个对象中的prop是否一一对应
  if (
    currPropArr.length === localPropArr.length &&
    !currPropArr.every((prop: any) => localPropArr.includes(prop))
  ) {
    return false;
  }
  let bool = true;
  for (let i = 0; i < cloneCurr.length; i++) {
    const prop = cloneCurr[i].prop;
    const local = cloneLocal.find((item: any) => item.prop === prop);
    const curr = cloneCurr.find((item: any) => item.prop === prop);
    if (JSON.stringify(local) !== JSON.stringify(curr)) {
      bool = false;
      break;
    }
  }
  return bool;
}

export const initDrag = (id: String) => {
  const node = document.querySelector(`#${id}`);
  let draging: any = null;
  //使用事件委托，将li的事件委托给ul
  (node as any).ondragstart = function (event: any) {
    //console.log("start");
    //firefox设置了setData后元素才能拖动！！！！
    event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
    //event.dataTransfer.setData("self", event.target);
    draging = event.target;
  };
  (node as any).ondragover = function (event: any) {
    //console.log("onDrop over");
    event.preventDefault();
    const target = event.target;
    //因为dragover会发生在ul上，所以要判断是不是li
    if (target.nodeName === "LI") {
      if (target !== draging) {
        const targetRect = target.getBoundingClientRect();
        const dragingRect = draging.getBoundingClientRect();
        if (target) {
          if (target.animated) {
            return;
          }
        }
        if (_index(draging) < _index(target)) {
          target.parentNode.insertBefore(draging, target.nextSibling);
        } else {
          target.parentNode.insertBefore(draging, target);
        }
        _animate(dragingRect, draging);
        _animate(targetRect, target);
      }
    }
  };
  //获取元素在父元素中的index
  function _index(el: any) {
    let index = 0;

    if (!el || !el.parentNode) {
      return -1;
    }

    while (el && (el = el.previousElementSibling)) {
      //console.log(el);
      index++;
    }

    return index;
  }

  function _animate(prevRect: any, target: any) {
    const ms = 300;

    if (ms) {
      const currentRect = target.getBoundingClientRect();

      if (prevRect.nodeType === 1) {
        prevRect = prevRect.getBoundingClientRect();
      }

      _css(target, "transition", "none");
      _css(
        target,
        "transform",
        "translate3d(" +
          (prevRect.left - currentRect.left) +
          "px," +
          (prevRect.top - currentRect.top) +
          "px,0)"
      );

      target.offsetWidth; // 触发重绘
      //放在timeout里面也可以
      // setTimeout(function() {
      //     _css(target, 'transition', 'all ' + ms + 'ms');
      //     _css(target, 'transform', 'translate3d(0,0,0)');
      // }, 0);
      _css(target, "transition", "all " + ms + "ms");
      _css(target, "transform", "translate3d(0,0,0)");

      clearTimeout(target.animated);
      target.animated = setTimeout(function () {
        _css(target, "transition", "");
        _css(target, "transform", "");
        target.animated = false;
      }, ms);
    }
  }
  //给元素添加style
  function _css(el: any, prop: any, val: any) {
    const style = el && el.style;

    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, "");
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style)) {
          prop = "-webkit-" + prop;
        }

        style[prop] = val + (typeof val === "string" ? "" : "px");
      }
    }
  }
};
