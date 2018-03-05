const uniqueID = (function(){
  var _seed = +new Date;
  return function(){
      return ''+(_seed++);
  };
})();


const factory = ({
  value = '',
  uid = uniqueID(),
  completed = false
} = {}) => ({value, uid, completed})

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
    return {
      todos: [],
      temp: '',
      visibility: 'all',
      editingTodo: null,
      allDone: false,
    }
  },

  computed: {
    remaining () {
      return this.todos.filter(todo => !todo.completed).length;
    },
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
    oneItemChanged(value){
      let x = [];
      value.forEach((item) => {
        x[item.uid] = item;
      })
      this.todos.forEach((item) => {
        if(x[item.uid]) item.completed = true;
        else            item.completed = false;
      })
      x = null
      //this.parentVM.selectedVM
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
