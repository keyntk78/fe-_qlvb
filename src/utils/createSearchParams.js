export async function createSearchParams(pageState) {
  const params = new URLSearchParams();
  if (pageState.search) {
    params.append('Search', pageState.search);
  }
  if (pageState.order) {
    params.append('Order', pageState.order);
  }
  if (pageState.orderDir) {
    params.append('OrderDir', pageState.orderDir);
  }
  params.append('StartIndex', pageState.startIndex);
  params.append('PageSize', pageState.pageSize);

  return params;
}
  