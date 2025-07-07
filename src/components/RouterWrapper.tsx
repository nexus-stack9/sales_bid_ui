export const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  // This component is now a simple wrapper that doesn't trigger any API calls
  // The pathname tracking has been removed to prevent unnecessary wishlist API calls
  return <>{children}</>;
};
