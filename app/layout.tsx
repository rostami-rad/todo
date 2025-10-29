import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trello Clone - Demo Board",
  description: "A Trello-like Kanban board application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
