const ITEM_PREFIX = ""
const USER_PREFIX = "user"

class LocalStorageArySlotHandler() {
  constructor(id, storage) {
    this.id = String(id)
    this.storage = storage || localStorage
    this.key = USER_PREFIX + this.id
  }

  get(item_id) {
    getAll[Number(item_id)-1]
  }
  
  put(item) {
    this.storage.setItem(this.key, JSON.stringify(getAll().concat(item)))
  }
  
  getAll() {
    return JSON.parse(this.storage.getItem(this.key) || "[]")
  }

  fill_with_defaults(json_file) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", json_file)
    xhr.onload = function() {
      let items = JSON.parse(xhr.response)
      }
    }
    xhr.send()
  }
}

class LocalStorageDBHandler {
  constructor(storage_object) {
    this.storage = storage_object || localStorage
  }

  put(item) {
    let key = make_idkey(item)
    if(this.storage.key) {
      throw "key exists: " + key
    } else {
      let item_w_id = {...item, id: key}
      this.storage.setItem(key, JSON.stringify(item_w_id))
    }
  }

  get(key) {
    if(this.storage.key) {
      JSON.parse(this.storage.getItem(key))
    } else {
      throw "key does not exist: " + key
    }
  }

  getAll() {
    return Object.keys(this.storage)
             .filter((k)=>k.startsWith(ITEM_PREFIX))
             .map((k)=>get(k))
  }

  modify(key, props) {
    let data = get(key)
    for(let k of Object.keys(props)) {
      data[k] = props[k]
    }
    this.storage.setItem(key, data)
  }

  remove(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }

  exists(key) {
    this.storage.key ? true : false
  }

  fill_with_defaults(json_file) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", json_file)
    xhr.onload = function() {
      let items = JSON.parse(xhr.response)
      for(let i of items) {
        try { put(i) } catch { }
      }
    }
    xhr.send()
  }

  make_idkey(data) {
    let max_id_number = Object.keys(this.storage)
      .filter(k => k.startsWith(ITEM_PREFIX))
      .map(k => Number(k.replace(`^${ITEM_PREFIX}`, "")))
      .sort((a,b) => b - a)[0] || 0

    return ITEM_PREFIX + String(max_id_number+1)
  }
}
