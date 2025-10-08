import AppToaster from "../../components/Toaster";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppToaster />
      {children}
    </>
  );
}






