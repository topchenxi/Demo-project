
export const localStorage = {};

let storage = window.localStorage;

  // 存储 localStorage
localStorage.set = (name, content) => {
    if (!name) return;
    if (typeof content !== "string") {
      content = JSON.stringify(content);
    }
    storage.setItem(name, content);
  };

  // 获取 localStorage
  localStorage.get = name => {
    if (!name) return;
   return storage.getItem(name);
  };

  //  移除 localStorage
  localStorage.remove = name => {
    if (!name) return;
    storage.removeItem(name);
  };



