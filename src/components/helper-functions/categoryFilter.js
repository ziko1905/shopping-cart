function categoryFilter(arr) {
  let filtered = new Proxy(
    {},
    {
      get: (filteredObj, category) =>
        category in filteredObj ? filteredObj[category] : [],
    },
  );
  arr.forEach((obj) => {
    filtered[obj.category] = [...filtered[obj.category], obj.id];
  });

  return filtered;
}

export default categoryFilter;
