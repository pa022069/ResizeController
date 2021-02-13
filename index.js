// 外框數據
let wrapper = document.getElementById("box");
let wrapperInfo = wrapper.getBoundingClientRect();

// 物件數據
let item = document.getElementById("item");
let itemInfo = item.getBoundingClientRect();
let itemOrigin = {
    x: itemInfo.x,
    y: itemInfo.y
}

let originPos;
let movingPos;
let startPos = {
    x: 0,
    y: 0
};
let borderWidth = 1 * 2;

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

    let wrapperWidth = wrapperInfo.width - itemInfo.width - borderWidth;

    if (movingPos.x >= 0 && movingPos.x <= wrapperWidth) {
        item.style.left = `${movingPos.x}px`;
    }
    if (movingPos.x < 0) {
        item.style.left = `0px`;
    }
    if (movingPos.x > wrapperWidth) {
        item.style.left = `${wrapperWidth}px`;
    };

    let wrapperHeight = wrapperInfo.height - itemInfo.height - borderWidth;

    if (movingPos.y >= 0 && movingPos.y <= wrapperHeight) {
        item.style.top = `${movingPos.y}px`;
    }
    if (movingPos.y < 0) {
        item.style.top = `0px`;
    }
    if (movingPos.y > wrapperHeight) {
        item.style.top = `${wrapperHeight}px`;
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

let resizeOrigin;
let resizeMoving;
let resizeTarget;

function closeResize() {
    itemInfo = item.getBoundingClientRect();
    startPos = {
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

    resizeMoving = {
        x: e.clientX - resizeOrigin.x,
        y: e.clientY - resizeOrigin.y
    }

    let newWidth = startPos.x + itemInfo.width + resizeMoving.x;
    let newHeight = startPos.y + itemInfo.height + resizeMoving.y;

    // 尺寸
    function setResizeWidth(_direct = '') {
        if (newWidth <= wrapperInfo.width && item.clientWidth >= 40) {
            item.style.width = `${itemInfo.width + (_direct === "reverse" ? -(resizeMoving.x) : resizeMoving.x)}px`;
        }
        if (newWidth > wrapperInfo.width) {
            item.style.width = `${wrapperInfo.width - 4 - startPos.x}px`;
        }
        if (item.clientWidth < 40) {
            item.style.width = `40px`
        }
    }
    function setResizeHeight(_direct = '') {
        if (newHeight <= wrapperInfo.height && item.clientHeight >= 40) {
            item.style.height = `${itemInfo.height + (_direct === "reverse" ? -(resizeMoving.y) : resizeMoving.y)}px`;
        }
        if (newHeight > wrapperInfo.height) {
            item.style.height = `${wrapperInfo.height - 4 - startPos.y}px`;
        }
        if (item.clientHeight < 40) {
            item.style.height = `40px`
        }
    }

    // 座標
    // function setResizeX() {
    //     if (newWidth <= wrapperInfo.width && item.clientWidth >= 40) {
    //         item.style.left = `${movingPos.x + resizeMoving.x}px`;
    //     }
    // }
    // function setResizeY() {
    //     if (newHeight <= wrapperInfo.height && item.clientHeight >= 40) {
    //         item.style.top = `${movingPos.y + resizeMoving.y}px`;
    //     }
    // }

    if (resizeTarget === 'rb') {
        setResizeWidth()
        setResizeHeight()
    }

    // if (resizeTarget === 'lt') {
    //     setResizeWidth("reverse")
    //     setResizeHeight("reverse")
    //     setResizeX()
    //     setResizeY()
    // }
}