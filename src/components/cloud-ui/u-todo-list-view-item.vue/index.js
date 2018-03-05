import ListViewItem from 'proto-ui.vusion/src/u-list-view-item.vue';

export default {
  name: 'u-todo-list-view-item',
  mixins: [ListViewItem],
  parentName: 'u-todo-list-view',
  props: {
    editing: false
  }
}
