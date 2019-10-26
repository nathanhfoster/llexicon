const RouterPush = (history, route) => {
  const { pathname } = history.location;
  history.push(route, { previousRoute: pathname });
};

const RouterLinkPush = (history, route) => {
  const { pathname } = history.location;
  return {
    pathname: route,
    state: { previousRoute: pathname }
  };
};

export { RouterPush, RouterLinkPush };
