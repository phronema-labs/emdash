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
						name: "Summit Home Services",
						type: "HomeAndConstructionBusiness",
						address: "482 Industrial Parkway, Suite 5, Springfield, ST 62704",
						phone: "(555) 234-5678",
						email: "service@summithomeservices.com",
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
