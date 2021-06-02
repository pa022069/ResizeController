## 專案說明

`package` 為物件移動功能套件  
  
`project` 為專案應用實例 (imagemap 編輯器))


## 宣告參數為新的函示

let create = new resizer()


## `resizer()`可帶入物見參數

參數           | 功能  | 預設值 | 類別 
--------------|:-----:|:-----:|:-----:
container     | 容器 | body | css選擇器 (字串) 
add           | 新增按鈕 | #add | css選擇器 (字串)  
wrap          | 外框大小 | {width: 1040, height: 1040} | 物件 {width: int, height: int}
delete        | 移除選取按鈕 <br> 取得刪除按鈕的編號／索引值 | selector: #delete <br> getDelete: () => {}  | css選擇器 (字串) <br> callback函式
map           | 帶入訊息JSON | 空陣列 | 陣列
activeIdx     | callback當前目標編號／索引值 | 空函式 | callback函式


## 直接觸發函式

參數           | 功能  | 範例
--------------|:-----:|:-----:
getResultPos()| 取得所有按鈕資訊 | create.getResultPos()
addButton()   | 新增按鈕 | create.addButton()
deleteButton()| 移除選取按鈕 | create.deleteButton()
