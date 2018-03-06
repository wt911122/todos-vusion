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
  }
}
