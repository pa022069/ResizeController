// 合併版本
const resizer = function (_option = {
    container: 'body',
    item: '.item',
    add: '#add',
    remove: '#remove',
    delete: '#delete',
    get: '#get',
    map: []
}) {
    // 宣告
    const init = {
        container: _option.container || 'body',
        item: _option.item || '.item',
        add: _option.add || '#add',
        remove: _option.remove || '#remove',
        delete: _option.delete || '#delete',
        get: _option.get || '#get',
        map: _option.map || []
    }

    let itemIdx = init.map.length || 0;

    // 外框數據
    let wrapper = document.querySelector(init.container);
    let wrapperInfo = wrapper.getBoundingClientRect();

    let scale = wrapperInfo.width / 1040;

    // 物件數據
    let directArray = ['lt', 'rt', 'lb', 'rb'];
    let item;
    let itemActive = null;
    let itemActiveIdx = null;

    function initReset() {
        document.querySelector(init.container).innerHTML = "";
    }

    function setStart() {
        if (itemIdx === 0) {
            createItem(itemIdx);
        } else {
            for (let idx = 0; idx < itemIdx; idx++) {
                createItem(idx, _option.map[idx].area)
            }
        }
    }

    function createItem(_index, _info = null) {
        let template = document.createElement("div");
        wrapper.appendChild(template).setAttribute("class", `item item-${_index}`);

        item = document.querySelector(`.item-${_index}`);
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
        new build(item, _index, _info);
    }

    function deleteItem(_index = itemIdx) {
        let item = document.querySelectorAll(init.item)
        let target = item[item.length - 1];
        if (!target) return;

        wrapper.removeChild(target);
    }

    function deleteTargetItem(_item) {
        itemActive = null;
        if (!_item) return;
        wrapper.removeChild(_item);
    }
    function getAllPos() {
        let posIdx = document.querySelectorAll(init.item);
        let posArray = [];
        for (let item of posIdx) {
            let posInfo = item.getBoundingClientRect();
            posArray.push({
                x: parseInt((posInfo.x - wrapperInfo.x - 1) / scale),
                y: parseInt((posInfo.y - wrapperInfo.y - 1) / scale),
                width: parseInt((posInfo.width) / scale),
                height: parseInt((posInfo.height) / scale)
            })
        }
        return posArray;
    }

    // 封包程式
    const build = function (_item, _idx, _info = { x: 0, y: 0, width: 100, height: 100 }) {
        if (!_item || _idx < 0) return;

        let sizeInfo = _info || { x: 0, y: 0, width: 100, height: 100 };

        // active
        _item.addEventListener("mousedown", function () {
            let beforeIdx;
            let nowIdx;

            beforeIdx = itemActiveIdx;
            itemActive = _item;
            itemActiveIdx = _idx;
            nowIdx = _idx;

            document.querySelector(`.item-${nowIdx}`).classList.add("item--active");
            if (beforeIdx === null || beforeIdx === nowIdx) return;
            try {
                document.querySelector(`.item-${beforeIdx}`).classList.remove("item--active");
            } catch {
                return
            }
        })

        _item.style.left = `${sizeInfo.x * scale}px`;
        _item.style.top = `${sizeInfo.y * scale}px`;
        _item.style.width = `${sizeInfo.width * scale}px`
        _item.style.height = `${sizeInfo.height * scale}px`

        // constructor
        let itemInfo = _item.getBoundingClientRect();
        let borderWidth = 1 * 2;

        let itemOrigin = {
            x: wrapperInfo.x,
            y: wrapperInfo.y
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
            x: sizeInfo.x * scale || 0,
            y: sizeInfo.y * scale || 0
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

        function close() {
            reset()
            _item.onmousedown = dragDownItem;

            startPos = {
                x: itemInfo.x - itemOrigin.x,
                y: itemInfo.y - itemOrigin.y
            }

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

    // init
    {
        initReset()
        setStart()
    }

    document.querySelector(init.add).addEventListener("click", function () {
        itemIdx += 1;
        createItem(itemIdx);
    })
    document.querySelector(init.remove).addEventListener("click", function () {
        if (init.item.length === 0) return;
        deleteItem(init.item.length)
    })
    document.querySelector(init.delete).addEventListener("click", function () {
        if (!itemActive) return;
        deleteTargetItem(itemActive)
    })
    // document.querySelector(init.get).addEventListener("click", function () {
    //     console.log(getAllPos())
    // })
    return {
        getResultPos: getAllPos(),
        addButton: function () {
            itemIdx += 1;
            createItem(itemIdx);
        },
        removeButton: function () {
            if (init.item.length === 0) return;
            deleteItem(init.item.length)
        },
        deleteButton: function () {
            if (!itemActive) return;
            deleteTargetItem(itemActive)
        }
    }
}
