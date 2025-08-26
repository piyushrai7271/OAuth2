import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      {/* Center everything below the header */}
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
}
