import { AgentLayer, AgentStudio } from "@agentlayer/ui/icon";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { SiX } from "react-icons/si";
import "nextra-theme-docs/style.css";
import "./globals.css";

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = (
  <Banner storageKey="sdk-v0.0.1">AgentStudio SDK v0.0.1 is released 🎉</Banner>
);

const navbar = (
  <Navbar
    logo={
      <span className="flex items-center gap-2">
        <AgentStudio className="size-8 shrink-0" />
        <span>
          <b>Agent</b>Studio
        </span>
      </span>
    }
    projectIcon={<AgentLayer variant="monochrome" className="size-6" />}
    projectLink="https://agentlayer.xyz"
    chatIcon={<SiX className="size-4" />}
    chatLink="https://x.com/AgentStudioByAL"
  ></Navbar>
);

const footer = (
  <Footer className="text-xs">
    MIT {new Date().getFullYear()} © AgentLayer
  </Footer>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        color={{
          hue: {
            light: 84.8,
            dark: 83.7,
          },
          saturation: {
            light: 85.2,
            dark: 80.5,
          },
          lightness: {
            light: 34.5,
            dark: 44.3,
          },
        }}
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/agentlayer/studio/tree/main/apps/docs"
          footer={footer}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
