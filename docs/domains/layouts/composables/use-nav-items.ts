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
