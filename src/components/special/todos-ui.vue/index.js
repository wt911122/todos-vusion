// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
import stack from '../../../services/ajaxbus/stack';
const uniqueID = (function(){
  var _seed = +new Date;
  return function(){
      return ''+(_seed++);
  };
})();
const _ACTIVE = 1;
const _COMPLETE = 2;
var STORAGE_KEY = 'todos-vuejs-vusion-cli-1.0'
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

// app Vue instance
export default {
  name: 'todos-ui',
  // app initial state
  data (){
    const temp = todoStorage.fetch()
    return {
      todos: temp,
      newTodo: '',
      editedTodo: null,
      visibility: 'all'
    }
  },

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        stack.addTask(this.todos.map((todo) => ({
            id: todo.id,
            state: value ? _COMPLETE: _ACTIVE,
            crud: 'u',
          })));
        this.todos.forEach(function (todo) {
          todo.completed = value
        })

      }
    },

  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      const newTodo = {
        id: uniqueID(),
        title: value,
        completed: false
      }
      stack.addTask({
        id: newTodo.id,
        content: value,
        state: _ACTIVE,
        crud: 'c',
      });

      this.todos.push(newTodo)
      this.newTodo = ''
    },

    removeTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      stack.addTask({
        id: todo.id,
        crud: 'd',
      });
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }else{
        stack.addTask({
          id: todo.id,
          content: todo.title,
          crud: 'u'
        })
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      stack.addTask(
        filters.completed(this.todos).map((todo) => ({
          id: todo.id,
          crud: 'd',
        })));
      this.todos = filters.active(this.todos)
    },

    changeVisibilities: function(which) {
      this.visibility = which;
    },

    todoState: function(todo) {
      var obj = {}
      obj[this.$style.completed] = todo.completed
      obj[this.$style.editing] = todo == this.editedTodo
      console.log(obj)
      return obj;
    },

    todosState: function(state) {
      var obj = {}
      obj[this.$style.selected] = this.visibility === state;
      return obj;
    },

    toggleTodo: function(todo) {
      stack.addTask({
        id: todo.id,
        state: todo.completed === _ACTIVE ? _COMPLETE: _ACTIVE,
        crud: 'u',
      });
    }
  },

  mounted: function(){
    this.$nextTick(function () {
      //console.log(this.$attrs)
    })
    stack
      .initialize()
      .then(response => (response.json()))
      .catch(err => {console.log(err);})
      .then(data => {
        console.log(data)
        this.todos = data.map(item => ({
          id: item._id,
          title: item.content,
          completed: item.state === _COMPLETE
        }));
        stack.startEngine({_engineCycle:1000});
      })
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
};
