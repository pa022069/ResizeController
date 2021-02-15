// 合併版本

const resizer = function (_option = {
    container: 'body',
    item: '.item'
}) {
    // 宣告
    const init = {
        container: _option.container || 'body',
        item: _option.item || '.item',
    }
    // console.log(init.container, init.item);

    // 外框數據
    let wrapper = document.querySelector(init.container);
    let wrapperInfo = wrapper.getBoundingClientRect();

    // 物件數據
    let directArray = ['lt', 'tr', 'lb', 'rb'];
    let items = document.querySelectorAll(init.item);

    const build = function (_item) {
        // constructor
        let itemInfo = _item.getBoundingClientRect();
        let borderWidth = 1 * 2;

        let itemOrigin = {
            x: itemInfo.x,
            y: itemInfo.y
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
            x: 0,
            y: 0
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

            document.onmouseup = closeDrag;
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
                _item.style.left = `${movingArea.x - borderWidth}px`;
            };
            // position y
            if (movingPos.y >= 0 && movingPos.y <= movingArea.y) {
                _item.style.top = `${movingPos.y}px`;
            }
            if (movingPos.y < 0) {
                _item.style.top = `0px`;
            }
            if (movingPos.y > movingArea.y) {
                _item.style.top = `${movingArea.y - borderWidth}px`;
            };
        }

        function closeDrag() {
            reset()
            startPos = {
                x: itemInfo.x - itemOrigin.x,
                y: itemInfo.y - itemOrigin.y
            }
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
            document.onmouseup = closeResize;
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
                    _item.style.width = `${itemInfo.width + resizeMoving.x - 2}px`;
                }
                if (newResize.width > wrapperInfo.width) {
                    _item.style.width = `${wrapperInfo.width - 4 - startPos.x}px`;
                }
                if (_item.clientWidth < minSize) {
                    _item.style.width = `${minSize}px`
                }
            }
            function setResizeHeight() {
                if (startPos.y < 0) return;
                if (newResize.height <= wrapperInfo.height && _item.clientHeight >= minSize) {
                    _item.style.height = `${itemInfo.height + resizeMoving.y - 2}px`;
                }
                if (newResize.height > wrapperInfo.height) {
                    _item.style.height = `${wrapperInfo.height - 4 - startPos.y}px`;
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

        function closeResize() {
            reset()
            _item.onmousedown = dragDownItem;

            movingPos = {
                x: itemInfo.x - itemOrigin.x,
                y: itemInfo.y - itemOrigin.y
            }
        }

        function reset() {
            itemInfo = _item.getBoundingClientRect();
            document.onmouseup = null;
            document.onmousemove = null;
        }

        // start move
        _item.onmousedown = dragDownItem;

        // start resize
        for (let target of controller) {
            target.onmousedown = controlItem;
        }
    }

    for (let item of items) {
        for (let direct of directArray) {
            let arrow = document.createElement("span");
            item.appendChild(arrow).setAttribute("data-pos", direct);
        }
        new build(item);
    }
}

let dev = new resizer({
    container: '#box',
    item: '.item'
});