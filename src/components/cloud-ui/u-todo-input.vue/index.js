import Input from 'cloud-ui.vusion/src/u-input.vue';

export default {
  name: "u-todo-input",
  mixins: [Input],
  props: {
    customStyle: {},
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
};
