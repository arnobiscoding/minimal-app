export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 py-8">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-8">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Megamind . All rights reserved.
        </p>
        <div className="text-sm text-slate-500">Built for UIU Hack Day</div>
      </div>
    </footer>
  );
}
