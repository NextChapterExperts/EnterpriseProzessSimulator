import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAP Process Simulator & Advisory Suite | Enterprise AI Architecture',
  description: 'Simulations- und Entscheidungswerkzeug für SAP Geschäftsprozesse: Brownfield vs. BTP Clean Core, Pareto-Optimierung & OODA Loop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('sap_simulator_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="h-screen w-screen bg-slate-100 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 antialiased overflow-hidden flex flex-col transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
