const Mixins = {
    // return attribute value
    getAttribute(name) {
      // if nothing on object itself, use built-in getAttribute
      if(typeof(this[name])==="undefined") {
        return HTMLElement.prototype.getAttribute.call(this,name);
      }
      return  this[name];
    },
    // set attribute on object
    // extra argument lazy=true if change should not be reactive
    setAttribute(name,value,lazy) {
      // auxiliary test function
      const equal = (a,b) => {
        const typea = typeof(a),
        typeb = typeof(b);
        // same type and one of
        return typea === typeb &&
           // identical
           (a===b ||
           // same length, size, order
          (Array.isArray(a) && Array.isArray(b) && a.length===b.length
           && a.every((item,i) => b[i]===item)) ||
           // all keys the same
           (a && b && typea==="object" &&
            Object.keys(a).every(key => equal(a[key],b[key])) &&
            Object.keys(b).every(key => equal(a[key],b[key]))));
      };
      
      let type = typeof(value),
      oldvalue = this.getAttribute(name);
      const neq = !equal(oldvalue,value);
      
      // only make changes if new and old value are not equal
      // or change is non-reactive
      if(neq || lazy) {
        // remove object property and attribute is value is null
        if(value==null) delete this[name]; this.removeAttribute(name);
        // add to object if type is object
        if(type==="object") this[name] = value;
        // otherwise, use built-in setAttribute
        else HTMLElement.prototype.setAttribute.call(this,name,value);
      }
      // render if !lazy (i.e. is reactive), renderable, value changed
      if(!lazy && this.render && neq) this.render();
    },
    // not a great id generator, but good enough for demo
    genId() {
      return "id" + (Math.random()+"").substring(2);
    } 
  }
  const ToDoView = function({title="",listid="",done=false},
                             el = document.createElement("todo")){
    const attributes = {title,listid,done,...arguments[0]};
    Object.assign(el,Mixins);
    const keys = Object.keys(attributes);
    keys.forEach(key => el.setAttribute(key,attributes[key],true));
    el.id || (el.id = el.genId());
    window[el.id] = el;
    el.render = (listid) => el.innerHTML =
      `<li id="${el.id}">${el.title}
      <input type="checkbox" ${(el.done ? "checked" : "")} 
       onclick="(()=>${listid}.remove('${el.id}'))()">
      </li>`;
    return el;
  }
  const ToDoList = function({title="",todos=[]},
                             el = document.createElement("todolist")){
    const attributes = {title,todos,...arguments[0]};
    Object.assign(el,Mixins);
    const keys = Object.keys(attributes);
    keys.forEach(key => el.setAttribute(key,attributes[key],true));
    el.id || (el.id = el.genId());
    window[el.id] = el;
    el.add = () => { // Add a task
      const title = prompt("ToDo Name");
      if(title) {
        el.todos.push({title,id:el.genId()});
        el.render();
      }
    }
    el.remove = (id) => { // Remove a task
      const i = todos.findIndex((item) => item.id===id);
      if(i>=0) {
        el.todos.splice(i,1);
        el.render();
      }
    }
    el.claim = () => { // Claim list
      el.setAttribute("title","Your List");
    }
    el.render = () => el.innerHTML = 
      `<p>${el.title}</p>
       <button onclick="${el.id}.add()">Add Task</button>
       <button onclick="${el.id}.claim()">Claim</button>
       <ul>
       ${todos.reduce((accum,todo) => accum +=
                       ToDoView(todo).render(el.id),"")}
       </ul>`;
    return el;
  }
  // Now use the components
  const list = ToDoList({title:"My List"},
                        document.getElementById("todos"));
  list.render();