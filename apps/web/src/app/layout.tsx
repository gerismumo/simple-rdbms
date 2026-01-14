import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/code-highlight/styles.css";

import { MantineProvider } from "@mantine/core";
import { theme } from "../theme/theme";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider
          forceColorScheme="light"
          defaultColorScheme="light"
          theme={theme}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
