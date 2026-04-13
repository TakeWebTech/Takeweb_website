export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div style={{ padding: "40px" }}>
      <h1>{slug.replace("-", " ")}</h1>
    </div>
  );
}