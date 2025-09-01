import React from "react";
import { useParams } from "react-router-dom";

const humanize = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const title = slug ? humanize(slug) : "Category";
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <p className="text-slate-500">Showing products for {title}.</p>
    </div>
  );
};

export default CategoryPage;