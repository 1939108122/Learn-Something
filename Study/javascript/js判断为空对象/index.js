function isEmptyObject(value){
  return value && Object.keys(value).length === 0 && value.constructor === Object;
}

// 判断 value 作用是避免 value为 undefined 或 null
// 判断 value.constructor === Object作用是避免js内置构造函数创建的对象，比如 new String('')
