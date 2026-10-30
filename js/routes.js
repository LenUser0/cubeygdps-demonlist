export default [
    { path: '/', component: () => import('./pages/List.js') },
    { path: '/leaderboard', component: () => import('./pages/Leaderboard.js') },
    { path: '/roulette', component: () => import('./pages/Roulette.js') },
];
