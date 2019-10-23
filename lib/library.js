class ToyLibrary {
  constructor(root_elmt) {
    this._root_elmt = root_elmt
    this._data = []
  }

  load(json_file, onload) {
    this.load_json(json_file,
      data_objects => {
        let items = this.make_items(data_objects)
        this.display(items)
        if(onload) onload(items)
      }
    )
  }

  sort_by_likes() {
    this._data.sort((a,b) => b.likeCount - a.likeCount)
  }

  sort_by_id() {
    this._data.sort((a,b) => Number(a._data.id) - Number(b._data.id))
  }

  sort_by_title() {
    this._data.sort((a,b) => a._data.title > b._data.title ? 1 : -1)
  }

  update() {
    this.clear()
    this.display(this._data)
  }



  make_items(data_objects) {
    this._data = Object.keys(data_objects).map(
      i => {
        let o = data_objects[i]
        o.id = i
        return new LibraryItem(o)
      }
    )
    return this._data
  }

  display(items) {
    items.forEach(i => this._root_elmt.appendChild(i.make_libitem_domobj()))
  }

  clear() {
    while(this._root_elmt.firstChild) {
      this._root_elmt.removeChild(this._root_elmt.firstChild)
    }
  }

  load_json(json_file, callback) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", json_file)
    xhr.onload = () => {
      let items = JSON.parse(xhr.response)
      callback(items)
    }
    xhr.send()
  }
}

class LibraryItem {
  constructor(data) {
    this._data = data
    this._like_button = this.make_like_button()
    this._dislike_button = this.make_dislike_button()
    this._like_count_elmt = this.make_like_count_elmt()

    this._cprefix = "libitem-"
  }

  get likeCount() { 
    return Number(this._data.numLikes) + Number(this.likedByUser) - Number(this.dislikedByUser)
  }
  get likedByUser() { 
    return this._data.userLikeState == 1 ? true : false
  }
  get dislikedByUser() { 
    return this._data.userLikeState == -1 ? true : false
  }

  toggleLike() {
    if(this.likedByUser) {
      this._data.userLikeState = 0
      this._like_button.className = "rating-inactive"
    } else {
      this._data.userLikeState = 1
      this._like_button.className = "rating-active"
      this._dislike_button.className = "rating-inactive"
    }
    this.like_count_change_effect()
    this._like_count_elmt.textContent = this.likeCount
  }
  
  toggleDislike() {
    if(this.dislikedByUser) {
      this._data.userLikeState = 0
      this._dislike_button.className = "rating-inactive"
    } else {
      this._data.userLikeState = -1
      this._dislike_button.className = "rating-active"
      this._like_button.className = "rating-inactive"
    }
    this.like_count_change_effect()
    this._like_count_elmt.textContent = this.likeCount
  }

  increase_like_count() {
    this._data.numLikes++
    this.like_count_change_effect()
    this._like_count_elmt.textContent = this.likeCount
  }

  like_count_change_effect() {
    this._like_count_elmt.style.transition = null
    this._like_count_elmt.style.backgroundColor = "lightblue"
    setTimeout(()=>{
      this._like_count_elmt.style.transition = "background-color 2s ease"
      this._like_count_elmt.style.backgroundColor = "white"
    }, 1000)
  }

  make_like_count_elmt() {
    return Util.make_domobj("li", null, "like-count", this.likeCount)
  }

  make_like_button() {
    let button_class = this.likedByUser ? "rating-active" : "rating-inactive"
    return Util.make_domobj("button", null, button_class, "👍", 
      el => el.addEventListener("click", e => this.toggleLike()))
  }

  make_dislike_button() {
    let button_class = this.dislikedByUser ? "rating-active" : "rating-inactive"
    return Util.make_domobj("button", null, button_class, "👎",
      el => el.addEventListener("click", e => this.toggleDislike()))
  }

  make_libitem_domobj() {
    return Util.make_domobj(
      "div",
      this._cprefix + this._data.id,
      this._cprefix + "card",
      [["div", null, this._cprefix + "imgbox",
         [["img", null, this._cprefix + "img", [], el => el.src = this._data.imgurl]]],                      
                     
       ["div", null, this._cprefix + "info",
         [["div", null, this._cprefix + "headinfo",
            [["h3", null, this._cprefix + "title"   , this._data.title],
             ["h4", null, this._cprefix + "year"    , this._data.year],
             ["h4", null, this._cprefix + "creators", this._data.creators.join(", ")]]],
          ["p" , null, this._cprefix + "descr"   , this._data.descr],
          ["ul", null, this._cprefix + "ratebox" ,
            [["li", null, this._cprefix + "like-button"   , this._like_button],
             ["li", null, this._cprefix + "like-count"    , this._like_count_elmt],
             ["li", null, this._cprefix + "dislike-button", this._dislike_button]]]]]])
  }
}

class LikeSimulator {
  constructor(items) {
    this.items = items
  }

  exec() {
    setTimeout(()=>{
      this.random_item().increase_like_count()
      this.exec()
    }, this.random_wait())
  }
  
  random_wait() {
    return Math.floor(Math.random() * 10) * 100
  }

  random_item() {
    return this.items[Math.floor(Math.random() * this.items.length)]
  }
}
