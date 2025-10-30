
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    // <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-lg">
          <h1 className="text-9xl font-display font-bold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-display font-semibold">Page Not Found</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            We couldn't find the page you were looking for. Perhaps you were looking for an auction that has ended or been removed.
          </p>
          <div className="mt-10">
            <Link to="/">
              <Button size="lg">Return to Homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    // </Layout>
  );
};

export default NotFound;
