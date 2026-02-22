function Layout({ left, right }) {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">{left}</div>

        {/* Right column */}
        <div className="flex flex-col gap-6">{right}</div>
      </div>
    </main>
  );
}

export default Layout;
