"use client";

import { use } from "react";

export default function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <div style={{ padding: "40px" }}>
      <h1>{slug.replace("-", " ")}</h1>
      <p>This solution page is dynamically generated.</p>
    </div>
  );
}