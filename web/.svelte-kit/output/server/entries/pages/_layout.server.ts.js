const load = async ({ locals }) => {
  return {
    isAuthenticated: locals.isAuthenticated,
    apiSecret: locals.apiSecret
  };
};
export {
  load
};
