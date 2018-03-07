var STORAGE_KEY = 'todos-vuejs-vusion-cli-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    console.log(JSON.stringify(todos))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const uniqueID = (function(){
  var _seed = +new Date;
  return function(){
      return ''+(_seed++);
  };
})();


let id = 0;
const factory = ({
  value = '',
  uid = uniqueID(),
  completed = false
} = {}) => {
  const target = {};
  Object.defineProperties(target, {
    'value': {
      set: function(newVal){
        if(value != newVal){
          console.log('newVal setted')
          value = newVal;
        }
      },
      get: function(){
        return value;
      },
      enumerable: true,
    },
    'completed': {
      set: function(newVal){
        if(value != newVal){
          console.log(`Completed setted ${id++}`)
          completed = newVal;
        }
      },
      get: function(){
        return completed;
      },
      enumerable: true,
    },
    'uid': {
      value: uid,
      writable: false,
      enumerable: true,
    }
  });

  return target
}

const localStyle = {
  newTodo: {
    padding: '16px 16px 16px 60px',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.003)',
    boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)',
  },
  editing:{
    display: 'block',
    width: '506px',
    padding: '12px 16px',
  }
}
export default {
  name : 'todos-vusion',
  data (){
    const temp = todoStorage.fetch()
    return {
      todos: temp,
      temp: '',
      visibility: 'all',
      editingTodo: null,
      allDone: false,
    }
  },

  watch: {
    todos:{
      handler: function (todos) {
        console.log("watched")
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  computed: {
    remaining () {
      return this.todos.filter(todo => !todo.completed).length;
    },
    completedTodos:{
      get(){
        return this.todos.filter(todo => todo.completed)
      },
      set(value){
        let x = [];
        value.forEach((item) => {
          x[item.uid] = item;
        })
        this.todos.forEach((item) => {
          if(x[item.uid]) item.completed = true;
          else            item.completed = false;
        })
        x = null
      }
    }
  },

  methods: {
    $customStyle() {
      return localStyle;
    },
    mapStyleWithNewStyle (newstyles, oldclass){
      console.log(newstyles, oldclass)
    },

    addTodo(){
      const str = this.temp.trim();
      if(str)
        this.todos.push(factory({value: str}))
      this.temp = "";
    },
    editTodo(todo) {
      this.editingTodo = todo;
    },
    doneEdit(todo) {
      this.editingTodo = null;
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    isVisible(todo) {
      const visibility = this.visibility;
      return visibility === 'all'
        || (visibility === 'active' && !todo.completed)
        || (visibility === 'completed' && todo.completed)
    },
    clearCompleted(){
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  }
}
