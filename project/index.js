const resizer = function (_option = {
  container: 'body',
  item: '.item',
  add: false,
  wrap: {
    width: 1040,
    height: 1040
  },
  delete: {
    selector: false,
    getDelete: () => { },
  },
  map: [],
  getActive: () => { },
  size: {}
}) {
  // 宣告
  const wrapSize = {
    width: _option.wrap ? _option.wrap.width : 1040,
    height: _option.wrap ? _option.wrap.height : 1040
  };
  let init = {
    container: _option.container || 'body',
    item: _option.item || '.item',
    add: _option.add || false,
    wrap: {
      width: _option.map ? _option.map.baseSize.width : wrapSize.width,
      height: _option.map ? _option.map.baseSize.height : wrapSize.height
    },
    delete: _option.delete || {
      selector: false,
      getDelete: () => { }
    },
    map: _option.map ? _option.map.actions : [],
    getActive: _option.getActive || (() => { }),
  }

  // 暫存
  let saveData = null;

  // 容器
  let wrapper = document.querySelector(init.container);
  wrapper.style.width = `700px`;
  wrapper.style.height = `${init.wrap.height * (700 / init.wrap.width)}px`;
  let wrapperInfo = wrapper.getBoundingClientRect();

  let wrapperSize = {
    width: wrapperInfo.width,
    height: wrapperInfo.height
  }

  let wrapperPos = {
    x: wrapperInfo.x,
    y: wrapperInfo.y
  }

  let beforeIdx;
  let nowIdx;
  let activeId;
  let saveIdx = [];

  // 物件
  let item;
  let itemActive = null;
  let itemArray = [];

  // let itemIdx = 0;
  // let itemIdx = init.map.length - 1 || 0;
  let itemIdx = init.map.length || 0;

  // 縮放比例
  let scaleX = wrapperSize.width / init.wrap.width;
  let scaleY = wrapperSize.height / init.wrap.height;

  // 方向
  let directArray = ['lt', 'rt', 'lb', 'rb'];

  let saveActive;

  function initReset() {
    return new Promise((resolve, reject) => {
      init = {
        container: _option.container || 'body',
        item: _option.item || '.item',
        add: _option.add || false,
        wrap: {
          width: _option.map ? _option.map.baseSize.width : wrapSize.width,
          height: _option.map ? _option.map.baseSize.height : wrapSize.height
        },
        delete: _option.delete || {
          selector: false,
          getDelete: () => { }
        },
        map: _option.map ? _option.map.actions : [],
        getActive: _option.getActive || (() => { })
      }
      wrapper = document.querySelector(init.container);
      wrapper.style.width = `700px`;
      wrapper.style.height = `${init.wrap.height * (700 / init.wrap.width)}px`;
      wrapperInfo = wrapper.getBoundingClientRect();

      wrapperSize = {
        width: wrapperInfo.width,
        height: wrapperInfo.height
      }
      wrapperPos = {
        x: wrapperInfo.x,
        y: wrapperInfo.y
      }
      saveData = null;
      saveIdx = [];
      itemArray = [];
      beforeIdx;
      nowIdx = null;
      activeId = null;
      saveIdx = [];
      item = null;
      itemArray = [];
      itemIdx = init.map.length || 0;
      // itemIdx = init.map.length - 1 || 0;
      document.querySelector(init.container).innerHTML = "";
      saveActive = null;

      resolve();
      reject();
    })
  }

  function updateInfo() {
    function getPos(el) {
      for (var lx = 0, ly = 0;
        el != null;
        lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
      return { x: lx, y: ly };
    }
    let wrapperPos = getPos(wrapper);

    let posIdx = document.querySelectorAll(`${init.container} ${init.item}`);
    let posArray = [];
    for (let pos of posIdx) {
      let itemSize = pos.getBoundingClientRect();
      let itemPos = getPos(pos);
      posArray.push({
        x: parseInt((itemPos.x - wrapperPos.x) / scaleX),
        y: parseInt((itemPos.y - wrapperPos.y) / scaleY),
        width: parseInt((itemSize.width) / scaleX),
        height: parseInt((itemSize.height) / scaleY)
      })
    }
    return posArray;
  }

  function createItem(_index, _info = null) {
    let template = document.createElement("div");
    wrapper.appendChild(template).setAttribute("class", `item item-${_index}`);

    item = document.querySelector(`${init.container} .item-${_index}`);

    for (let direct of directArray) {
      let arrow = document.createElement("span");
      item.appendChild(arrow).setAttribute("data-pos", direct);
    }

    let text = document.createElement("p");
    item.appendChild(text);

    let content = item.querySelector("p");
    content.innerText = _index + 1;

    function returnColor() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
      return {
        r: getRandomInt(255),
        g: getRandomInt(255),
        b: getRandomInt(255),
      }
    }
    item.style.backgroundColor = `rgba(${returnColor().r}, ${returnColor().g}, ${returnColor().b}, 0.5)`;
    new build(item, _index, _info, init.getActive);
  }

  function setStart() {
    if (itemIdx === 0) {
      createItem(itemIdx);
    } else {
      for (let idx = 0; idx < itemIdx; idx++) {
        createItem(idx, _option.map.actions[idx].area)
      }
    }
  }

  function deleteTargetItem(_item) {
    if (!_item) return;
    init.delete.getDelete(saveActive);
    saveIdx.splice(activeId, 1);
    wrapper.removeChild(_item);
    saveData = updateInfo();
  }

  // 封包程式
  const build = function (_item, _idx, _info = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }, _func) {
    if (!_item || _idx < 0) return;

    let sizeInfo = _info || {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    };

    saveIdx.push(_idx);

    // active
    _item.addEventListener("mousedown", function () {
      beforeIdx = nowIdx;

      itemActive = _item;
      nowIdx = _idx;
      activeId = saveIdx.indexOf(_idx);

      saveActive = {
        id: _idx + 1 || null,
        index: activeId
      }

      _func(saveActive)

      document.querySelector(`${init.container} .item-${_idx}`).classList.add("item--active");

      if (beforeIdx === null || beforeIdx === _idx) return;
      try {
        document.querySelector(`${init.container} .item-${beforeIdx}`).classList.remove("item--active");
      } catch {
        return
      }
    })

    itemArray.push({
      id: _idx,
      x: sizeInfo.x * scaleX,
      y: sizeInfo.y * scaleY,
      width: sizeInfo.width * scaleX,
      height: sizeInfo.height * scaleY
    })

    _item.style.left = `${sizeInfo.x * scaleX}px`;
    _item.style.top = `${sizeInfo.y * scaleY}px`;
    _item.style.width = `${sizeInfo.width * scaleX}px`
    _item.style.height = `${sizeInfo.height * scaleY}px`

    // constructor
    saveData = updateInfo();
    let itemInfo = _item.getBoundingClientRect();

    let itemOrigin = {
      x: wrapperPos.x,
      y: wrapperPos.y
    }

    let originPos = {
      x: 0,
      y: 0
    };

    let movingPos = {
      x: 0,
      y: 0
    };
    let startPos = {
      x: sizeInfo.x * scaleX || 0,
      y: sizeInfo.y * scaleY || 0
    };

    let movingArea = {
      x: 0,
      y: 0
    }

    // Resize 
    let controller = _item.querySelectorAll('span');
    let minSize = 40;

    let isReverse = {
      x: false,
      y: false
    }

    // function
    function dragDownItem(e) {
      e = e || window.event;
      e.preventDefault();

      originPos = {
        x: e.clientX,
        y: e.clientY
      }

      document.onmouseup = close;
      document.onmousemove = moveItem;
    }

    function moveItem(e) {
      e = e || window.event;

      movingPos = {
        x: startPos.x + e.clientX - originPos.x,
        y: startPos.y + e.clientY - originPos.y
      }

      movingArea = {
        x: wrapperInfo.width - itemInfo.width,
        y: wrapperInfo.height - itemInfo.height
      }

      // position x
      if (movingPos.x >= 0 && movingPos.x <= movingArea.x) {
        _item.style.left = `${movingPos.x}px`;
      }
      if (movingPos.x < 0) {
        _item.style.left = `0px`;
      }
      if (movingPos.x > movingArea.x) {
        _item.style.left = `${movingArea.x}px`;
      };
      // position y
      if (movingPos.y >= 0 && movingPos.y <= movingArea.y) {
        _item.style.top = `${movingPos.y}px`;
      }
      if (movingPos.y < 0) {
        _item.style.top = `0px`;
      }
      if (movingPos.y > movingArea.y) {
        _item.style.top = `${movingArea.y}px`;
      };
    }

    // Resize
    function controlItem(e) {
      e = e || window.event;
      e.preventDefault();

      let resizeTarget = e.target.attributes['data-pos'].value;
      if (resizeTarget === 'lt') {
        isReverse = {
          x: true,
          y: true
        }
      }

      if (resizeTarget === 'rt') {
        isReverse = {
          x: false,
          y: true
        }
      }

      if (resizeTarget === 'lb') {
        isReverse = {
          x: true,
          y: false
        }
      }

      if (resizeTarget === 'rb') {
        isReverse = {
          x: false,
          y: false
        }
      }

      originPos = {
        x: e.clientX,
        y: e.clientY
      }
      document.onmousemove = controlResize;

      _item.onmousedown = null;
      document.onmouseup = close;
    }

    function controlResize(e) {
      e = e || window.event;
      e.preventDefault();

      let resizing = {
        x: e.clientX - originPos.x,
        y: e.clientY - originPos.y
      }

      let resizeMoving = {
        x: isReverse.x ? -(resizing.x) : resizing.x,
        y: isReverse.y ? -(resizing.y) : resizing.y,
      }

      let newResize = {
        width: resizeMoving.x + itemInfo.width + startPos.x,
        height: resizeMoving.y + itemInfo.height + startPos.y,
        x: resizeMoving.x + startPos.x,
        y: resizeMoving.y + startPos.y
      }

      // 尺寸
      function setResizeWidth() {
        if (startPos.x < 0) return;
        if (newResize.width <= wrapperInfo.width && _item.clientWidth >= minSize) {
          _item.style.width = `${itemInfo.width + resizeMoving.x}px`;
        }
        if (newResize.width > wrapperInfo.width) {
          _item.style.width = `${wrapperInfo.width - startPos.x}px`;
        }
        if (_item.clientWidth < minSize) {
          _item.style.width = `${minSize}px`
        }
      }

      function setResizeHeight() {
        if (startPos.y < 0) return;
        if (newResize.height <= wrapperInfo.height && _item.clientHeight >= minSize) {
          _item.style.height = `${itemInfo.height + resizeMoving.y}px`;
        }
        if (newResize.height > wrapperInfo.height) {
          _item.style.height = `${wrapperInfo.height - startPos.y}px`;
        }
        if (_item.clientHeight < minSize) {
          _item.style.height = `${minSize}px`
        }
      }

      // 座標
      function setResizeX() {
        if (!isReverse.x) return;
        startPos.x = movingPos.x - resizeMoving.x;
        if (startPos.x > 0) {
          if (_item.clientWidth <= minSize) return;
          _item.style.left = `${startPos.x}px`;
        }
        if (startPos.x < 0) {
          _item.style.left = `0px`;
        }
      }

      function setResizeY() {
        if (!isReverse.y) return;
        startPos.y = movingPos.y - resizeMoving.y;
        if (startPos.y > 0) {
          if (_item.clientHeight <= minSize) return;
          _item.style.top = `${startPos.y}px`;
        }
        if (startPos.y < 0) {
          _item.style.top = `0px`;
        }
      }

      setResizeWidth()
      setResizeHeight()
      setResizeX()
      setResizeY()
    }

    function close() {
      _item.onmousedown = dragDownItem;

      itemInfo = _item.getBoundingClientRect();
      wrapperInfo = wrapper.getBoundingClientRect();
      itemOrigin = {
        x: wrapperInfo.x,
        y: wrapperInfo.y
      }

      startPos = {
        x: itemInfo.x - itemOrigin.x,
        y: itemInfo.y - itemOrigin.y
      }

      movingPos = {
        x: itemInfo.x - itemOrigin.x,
        y: itemInfo.y - itemOrigin.y
      }
      reset()
    }

    function reset() {
      itemInfo = _item.getBoundingClientRect();
      document.onmouseup = null;
      document.onmousemove = null;

      saveData = updateInfo();
    }

    // start move
    _item.onmousedown = dragDownItem;

    // start resize
    for (let target of controller) {
      target.onmousedown = controlItem;
    }
  }

  async function start() {
    await initReset();
    setStart();
  }
  start();

  function addItem() {
    itemIdx += 1;
    console.log(itemIdx)
    createItem(itemIdx);
  }

  function deleteItem() {
    if (!itemActive) return;
    deleteTargetItem(itemActive)
  }

  if (init.add) {
    document.querySelector(init.add).onmousedown = addItem;
  }
  if (init.delete.selector) {
    document.querySelector(init.delete.selector).onmousedown = deleteItem;
  }

  return {
    getResultPos: () => saveData,
    addButton: function () {
      itemIdx += 1;
      createItem(itemIdx);
    },
    deleteButton: function () {
      if (!itemActive) return;
      deleteTargetItem(itemActive)
    }
  }
}
