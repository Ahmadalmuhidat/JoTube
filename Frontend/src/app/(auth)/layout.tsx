interface LayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
