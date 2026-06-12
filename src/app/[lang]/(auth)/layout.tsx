export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-md mx-auto py-10">{children}</div>;
}
