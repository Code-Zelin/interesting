import Vue from 'vue';
import vueRouter from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';

Vue.use(vueRouter);

export default new vueRouter({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: 'about' */ './views/About.vue'),
    },
  ],
});
