export function AuthShell({ children }) {
    return (<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-ink-50 px-4 py-12">
      <div className="card w-full max-w-md p-8">{children}</div>
    </div>);
}
