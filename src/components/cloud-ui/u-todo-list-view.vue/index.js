import ListView from 'proto-ui.vusion/src/u-list-view.vue';

export default {
  name: 'u-todo-list-view',
  mixins: [ListView],
  props: {
    toggleAllFunc: undefined,
    alldone: false,
  },
  watch: {
    alldone(value) {
      this.itemVMs.forEach((itemVM) => {
        if(itemVM.currentSelected != value){
          this.select(itemVM)
        }
      })
    }
  },
  methods: {
    watchValue(value) {
      if (this.multiple){
          console.log(value)
          this.itemVMs.forEach((itemVM) => {
            itemVM.currentSelected = value && value.some(todo => todo.uid === itemVM.value.uid)
          });
      }
      else {
          if (this.selectedVM && this.selectedVM.value === value)
              return;
          if (value === undefined)
              this.selectedVM = undefined;
          else {
              this.selectedVM = this.itemVMs.find((itemVM) => itemVM.value === value);
              this.selectedVM && this.selectedVM.groupVM && this.selectedVM.groupVM.toggle(true);
          }
      }
  },
  }
}
