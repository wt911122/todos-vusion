import Index from './index.vue';
import Main from './main.vue';
import Overview from './overview.vue';
import Basic from './basic.vue';
import Form from './form.vue';
import Todo from './todo.vue';

export default [
    { path: '/', component: Index, children: [
        { path: '', component: Main },
        { path: 'overview', component: Overview },
        { path: 'basic', component: Basic },
        { path: 'form', component: Form },
        { path: 'todo', component: Todo}
    ] },
];
