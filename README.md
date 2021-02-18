## 專案說明

`package` 為物件移動功能套件  
  
`project` 為專案應用實力 (imagemap 編輯器))


## 宣告參數為新的函示

let create = new resizer()


## `resizer()`可帶入物見參數

參數           | 功能  | 預設值 | 類別 
--------------|:-----:|:-----:|:-----:
container     | 容器 | body | css選擇器 (字串) 
add           | 新增按鈕 | #add | css選擇器 (字串)  
remove        | 移除最新按鈕 | #remove | css選擇器 (字串)  
delete        | 移除選取按鈕 | #delete | css選擇器 (字串)  
map           | 帶入訊息JSON | 空陣列 | 陣列


## 直接觸發函式

參數           | 功能  | 範例
--------------|:-----:|:-----:
getResultPos  | 取得所有按鈕資訊 | create.getResultPos
addButton()   | 新增按鈕 | create.addButton()
removeButton()| 移除最新按鈕 | create.removeButton()
deleteButton()| 移除選取按鈕 | create.deleteButton()