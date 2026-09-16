import Navbar from "./Navbar";

function AppLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="pt-16">{children}</main>
    </>
  );
}

export default AppLayout;
