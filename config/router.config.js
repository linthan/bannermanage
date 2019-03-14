export default [
  // user
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/manage/world' },
      // dashboard
      {
        path: '/manage',
        name: 'manage',
        icon: 'setting',
        routes: [
          {
            path: '/manage/world',
            name: 'world',
            permission: 'manage.world',
            component: './Manage/World',
            icon: 'smile',
          },
        ],
      },
      {
        path: '/maili',
        name: 'maili',
        icon: 'heart',
        routes: [
          {
            path: '/maili/banner',
            name: 'banner',
            component: './Maili/Banner',
            icon: 'smile',
          },
          {
            path: '/maili/bannerc/:slug',
            name: 'banner',
            component: './Maili/form/BannerDetail',
            hideInMenu: true,
            icon: 'smile',
          },
        ],
      },
    ],
  },
];
