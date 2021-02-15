// 外框數據
let wrapper = document.getElementById("box");
let wrapperInfo = wrapper.getBoundingClientRect();



// 物件數據
let item = document.querySelectorAll(".item")[1];
let itemInfo = item.getBoundingClientRect();
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
    e.preventDefault();

    movingPos = {
        x: startPos.x + e.clientX - originPos.x,
        y: startPos.y + e.clientY - originPos.y
    }

    let wrapperWidth = wrapperInfo.width - itemInfo.width;

    if (movingPos.x >= 0 && movingPos.x <= wrapperWidth) {
        item.style.left = `${movingPos.x}px`;
    }
    if (movingPos.x < 0) {
        item.style.left = `0px`;
    }
    if (movingPos.x > wrapperWidth) {
        item.style.left = `${wrapperWidth - borderWidth}px`;
    };

    let wrapperHeight = wrapperInfo.height - itemInfo.height;

    if (movingPos.y >= 0 && movingPos.y <= wrapperHeight) {
        item.style.top = `${movingPos.y}px`;
    }
    if (movingPos.y < 0) {
        item.style.top = `0px`;
    }
    if (movingPos.y > wrapperHeight) {
        item.style.top = `${wrapperHeight - borderWidth}px`;
    };
}

function closeDrag() {
    startPos = {
        x: item.getBoundingClientRect().x - itemOrigin.x,
        y: item.getBoundingClientRect().y - itemOrigin.y
    }
    document.onmouseup = null;
    document.onmousemove = null;
}
item.onmousedown = dragDownItem;

// Resize

let controller = document.querySelectorAll('span');
for (let target of controller) {
    target.onmousedown = controlItem;
}
let minSize = 40;
let resizeOrigin;
let resizeMoving;
let resizeTarget;

let isReverse = {
    x: false,
    y: false
}

function closeResize() {
    itemInfo = item.getBoundingClientRect();
    movingPos = {
        x: itemInfo.x - itemOrigin.x,
        y: itemInfo.y - itemOrigin.y
    }
    item.onmousedown = dragDownItem;

    document.onmouseup = null;
    document.onmousemove = null;
}

function controlItem(e) {
    e = e || window.event;
    e.preventDefault();

    resizeTarget = e.target.attributes['data-pos'].value;
    resizeOrigin = {
        x: e.clientX,
        y: e.clientY
    }
    document.onmousemove = controlResize;

    item.onmousedown = null;
    document.onmouseup = closeResize;
}

function controlResize(e) {
    e = e || window.event;
    e.preventDefault();

    let resizing = {
        x: e.clientX - resizeOrigin.x,
        y: e.clientY - resizeOrigin.y
    }

    resizeMoving = {
        x: isReverse.x ? -(resizing.x) : resizing.x,
        y: isReverse.y ? -(resizing.y) : resizing.y,
    }

    let newResize = {
        width: resizeMoving.x + itemInfo.width,
        height: resizeMoving.y + itemInfo.height,
        x: startPos.x + resizeMoving.x,
        y: startPos.y + resizeMoving.y
    }
    
    // 尺寸
    function setResizeWidth() {
        if(startPos.x < 0) return;
        if (newResize.width + startPos.x <= wrapperInfo.width && item.clientWidth >= minSize) {
            item.style.width = `${itemInfo.width + resizeMoving.x - 2}px`;
        }
        if (newResize.width + startPos.x > wrapperInfo.width) {
            item.style.width = `${wrapperInfo.width - 4 - startPos.x}px`;
        }
        if (item.clientWidth < minSize) {
            item.style.width = `${minSize}px`
        }
    }
    function setResizeHeight() {
        if(startPos.y < 0) return;
        if (newResize.height + startPos.y <= wrapperInfo.height && item.clientHeight >= minSize) {
            item.style.height = `${itemInfo.height + resizeMoving.y - 2}px`;
        }
        if (newResize.height + startPos.y > wrapperInfo.height) {
            item.style.height = `${wrapperInfo.height - 4 - startPos.y}px`;
        }
        if (item.clientHeight < minSize) {
            item.style.height = `${minSize}px`
        }
    }

    // 座標
    function setResizeX() {
        if (!isReverse.x) return;
        startPos.x = movingPos.x - resizeMoving.x;
        if (startPos.x > 0) {
            if (item.clientWidth <= minSize) return;
            item.style.left = `${startPos.x}px`;
        } 
        if (startPos.x < 0) {
            item.style.left = `0px`;
        }
    }
    function setResizeY() {
        if (!isReverse.y) return;
        startPos.y = movingPos.y - resizeMoving.y;
        if (startPos.y > 0) {
            if (item.clientHeight <= minSize) return;
            item.style.top = `${startPos.y}px`;
        } 
        if (startPos.y < 0) {
            item.style.top = `0px`;
        }
    }

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

    setResizeWidth()
    setResizeHeight()
    setResizeX()
    setResizeY()
}