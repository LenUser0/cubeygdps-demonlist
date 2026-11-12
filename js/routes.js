export default [
    { path: '/', component: () => import('./pages/List.js?v=20261112-2') },
    { path: '/leaderboard', component: () => import('./pages/Leaderboard.js') },
    { path: '/roulette', component: () => import('./pages/Roulette.js') },
    // Unlisted helper page. GitHub Pages is static, so this route is not access-controlled.
    { path: '/moderator-tools', component: () => import('./pages/Generator.js') },
];
