import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <Footer/>
    </div>
  );
}
