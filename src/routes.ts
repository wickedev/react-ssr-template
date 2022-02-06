export const routes = [
    {
      component: async () => {
        const module = await import('./pages/About');
  
        return module.AboutPage;
      },
      path: '/about',
    },
    {
      component: async () => {
        const module = await import('./pages/Home');
  
        return module.HomePage;
      },
      path: '/',
    },
    {
      component: async () => {
        const module = await import('./pages/NotFound');
  
        return module.NotFoundPage;
      },
      path: '*',
    },
  ];
  