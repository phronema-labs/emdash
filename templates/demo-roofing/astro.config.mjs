import node from "@astrojs/node";
import react from "@astrojs/react";
import { businessBlocksPlugin } from "@emdash-cms/plugin-business-blocks";
import { auditLogPlugin } from "@emdash-cms/plugin-audit-log";
import { formsPlugin } from "@emdash-cms/plugin-forms";
import { seoPlugin } from "@emdash-cms/plugin-seo";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
	output: "server",
	adapter: node({ mode: "standalone" }),
	image: {
		layout: "constrained",
		experimentalResponsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [
				businessBlocksPlugin(),
				seoPlugin({
					titleTemplate: "%title% | %sitename%",
					structuredData: true,
					business: {
						name: "Apex Roofing Co.",
						type: "RoofingContractor",
						address: "1847 E Main St, Mesa, AZ 85203",
						phone: "(480) 555-8900",
						email: "info@apexroofingco.com",
						priceRange: "$$",
					},
				}),
				formsPlugin(),
				auditLogPlugin(),
			],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
		},
	],
	devToolbar: { enabled: false },
});
