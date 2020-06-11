import asyncComponent from '@/components/asyncComponent';
// import redirectComponent from '@/components/redirectComponent';

export default [  
  // {
  //   component: asyncComponent(() => import('../containers/address/addressinfo')),
  //   path: '/address/:address',
  // },
  {
    component: asyncComponent(() => import('../containers/transaction/layout')),
    path: '/transaction',
    children:[
      {
        component: asyncComponent(() => import('../containers/transaction/tran')),
        path: '/transaction/tran',
      },
      {
        component: asyncComponent(() => import('../containers/transaction/pool')),
        path: '/transaction/pool',
      },
    ]
  },
  {
    component: asyncComponent(() => import('../containers/bourse/layout')),
    path: '/bourse',
    children:[
      {
        component: asyncComponent(() => import('../containers/bourse/txhistory')),
        path: '/bourse/txhistory',
      },
      {
        component: asyncComponent(() => import('../containers/bourse/askbuymarket')),
        path: '/bourse/askbuymarket',
      },
    ]
  },
  {
    component: asyncComponent(() => import('../containers/search/index')),
    path: '/search',
  },
  {
    component: asyncComponent(() => import('../containers/notfound')),
    path: '/:any',
  },
  {
    component: asyncComponent(() => import('../containers/home')),
    exact: true,
    path: '/',
  },
];

