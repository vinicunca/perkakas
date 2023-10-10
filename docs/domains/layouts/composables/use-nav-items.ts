export function useNavItems() {
  const navItems = [
    {
      title: 'Installation',
      _path: '/installation',
    },
    {
      title: 'Documentation',
      _path: '/docs',
    },
    {
      title: 'Try Perkakas',
      _path: '/try-perkakas',
    },
  ];

  const route = useRoute();

  function isActive(link: any) {
    return route.fullPath.startsWith(link._path);
  }

  return {
    navItems,
    isActive,
  };
}
