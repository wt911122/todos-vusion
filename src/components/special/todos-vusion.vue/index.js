import stack from '../../../services/ajaxbus/stack';
const _ACTIVE = 1;
const _COMPLETE = 2;

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
          console.log(uid)
          stack.addTaskThrottle({
            id: uid,
            content: newVal,
            crud: 'u'
          })
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
          stack.addTask({
            id: uid,
            state: newVal ? _COMPLETE: _ACTIVE,
            crud: 'u',
          });
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
        //console.log(value)
        value.forEach((item) => {

          x[item.uid] = item;
        })
        this.todos.forEach((item) => {
          console.log(item.completed)
          if(x[item.uid] && !item.completed){
            console.log(`${item.value} completed`)
            item.completed = true;
          }
          else if(!!!x[item.uid] && item.completed){
            console.log(`${item.value} active`)
            item.completed = false;
          }
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
      if(str){
        const todo = factory({value: str});
        this.todos.push(todo)
        stack.addTask({
          id: todo.uid,
          content: todo.value,
          state: todo.completed ? _COMPLETE: _ACTIVE,
          crud: 'c',
        });
      }
      this.temp = "";
    },
    editTodo(todo) {
      this.editingTodo = todo;
    },
    doneEdit(todo) {
      this.editingTodo = null;
    },
    removeTodo(index) {
      const todo = this.todos[index];
      stack.addTask({
        id: todo.uid,
        crud: 'd',
      });
      this.todos.splice(index, 1);
    },
    isVisible(todo) {
      const visibility = this.visibility;
      return visibility === 'all'
        || (visibility === 'active' && !todo.completed)
        || (visibility === 'completed' && todo.completed)
    },
    clearCompleted(){
      stack.addTask(
        this.todos
          .filter(todo => todo.completed)
          .map(todo => ({
            id: todo.uid,
            crud: 'd',
          }))
      );
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  },
  mounted: function(){
    stack
      .initialize()
      .then(response => (response.json()))
      .catch(err => {console.log(err);})
      .then(data => {
        console.log(data)

        this.todos = data.map(item => (factory({
          uid: item._id,
          value: item.content,
          completed: item.state === _COMPLETE
        })));
        stack.startEngine({_engineCycle:1000});
      });
  },

}
