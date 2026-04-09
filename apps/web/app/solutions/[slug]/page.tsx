export default function SolutionPage({ params }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>{params.slug.replace("-", " ")}</h1>
      <p>This solution page is dynamically generated.</p>
    </div>
  );
}