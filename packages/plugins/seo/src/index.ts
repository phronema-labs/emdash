import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

export interface SeoPluginOptions {
	/** Title template, use %title% and %sitename% as placeholders */
	titleTemplate?: string;
	/** Default meta description */
	defaultDescription?: string;
	/** Default social image URL */
	defaultImage?: string;
	/** Google Search Console verification code */
	googleVerification?: string;
	/** Enable JSON-LD structured data */
	structuredData?: boolean;
	/** Business info for LocalBusiness schema */
	business?: {
		name?: string;
		type?: string;
		address?: string;
		phone?: string;
		email?: string;
		url?: string;
		priceRange?: string;
	};
}

export function seoPlugin(
	options: SeoPluginOptions = {},
): PluginDescriptor<SeoPluginOptions> {
	return {
		id: "seo",
		version: "0.1.0",
		entrypoint: "@emdash-cms/plugin-seo",
		options,
		capabilities: ["read:content"],
		adminWidgets: [
			{ id: "seo-overview", title: "SEO Overview", size: "half" },
		],
	};
}

export function createPlugin(options: SeoPluginOptions = {}): ResolvedPlugin {
	const titleTemplate = options.titleTemplate ?? "%title% | %sitename%";
	const enableStructuredData = options.structuredData !== false;

	return definePlugin({
		id: "seo",
		version: "0.1.0",
		capabilities: ["read:content"],

		hooks: {
			"page:metadata": {
				handler: async (_event, ctx) => {
					const meta: Array<{ tag: string; attrs: Record<string, string> }> = [];

					// Google verification
					const googleCode =
						options.googleVerification ??
						(await ctx.kv.get<string>("settings:googleVerification"));
					if (googleCode) {
						meta.push({
							tag: "meta",
							attrs: { name: "google-site-verification", content: googleCode },
						});
					}

					// Robots defaults
					meta.push({
						tag: "meta",
						attrs: { name: "robots", content: "index, follow" },
					});

					// JSON-LD for LocalBusiness
					if (enableStructuredData && options.business) {
						const b = options.business;
						const jsonLd = {
							"@context": "https://schema.org",
							"@type": b.type || "LocalBusiness",
							name: b.name,
							address: b.address,
							telephone: b.phone,
							email: b.email,
							url: b.url,
							priceRange: b.priceRange,
						};

						meta.push({
							tag: "script",
							attrs: {
								type: "application/ld+json",
								textContent: JSON.stringify(jsonLd),
							},
						});
					}

					return { meta };
				},
			},
		},

		routes: {
			sitemap: {
				public: true,
				handler: async (ctx) => {
					const collections = ["pages", "posts", "services", "projects"];
					const baseUrl =
						options.business?.url ?? ctx.site?.url ?? "https://example.com";
					let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
					xml +=
						'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

					// Homepage
					xml += `  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>\n`;

					// Static pages
					for (const page of [
						"/services",
						"/work",
						"/about",
						"/blog",
						"/faq",
						"/contact",
					]) {
						xml += `  <url><loc>${baseUrl}${page}</loc><priority>0.8</priority></url>\n`;
					}

					// Dynamic content
					if (ctx.content) {
						for (const collection of collections) {
							try {
								const result = await ctx.content.list(collection, {
									status: "published",
									limit: 1000,
								});
								const pathPrefix =
									collection === "pages"
										? "/pages"
										: collection === "posts"
											? "/blog"
											: collection === "services"
												? "/services"
												: "/work";

								for (const item of result.items) {
									const slug = item.slug ?? item.id;
									xml += `  <url><loc>${baseUrl}${pathPrefix}/${slug}</loc><priority>0.6</priority></url>\n`;
								}
							} catch {
								// Collection may not exist, skip
							}
						}
					}

					xml += "</urlset>";

					return new Response(xml, {
						headers: { "Content-Type": "application/xml" },
					});
				},
			},
			robots: {
				public: true,
				handler: async (ctx) => {
					const baseUrl =
						options.business?.url ?? ctx.site?.url ?? "https://example.com";
					const sitemapUrl = `${baseUrl}/_emdash/api/plugins/seo/sitemap`;

					const robotsTxt = [
						"User-agent: *",
						"Allow: /",
						"",
						"# Admin area",
						"Disallow: /_emdash/",
						"",
						`Sitemap: ${sitemapUrl}`,
					].join("\n");

					return new Response(robotsTxt, {
						headers: { "Content-Type": "text/plain" },
					});
				},
			},
			analyze: {
				handler: async (ctx) => {
					const input = ctx.input as { text?: string; title?: string; description?: string };
					const issues: string[] = [];
					const suggestions: string[] = [];

					if (input.title) {
						if (input.title.length < 30)
							issues.push("Title is too short (under 30 characters)");
						if (input.title.length > 60)
							issues.push("Title is too long (over 60 characters)");
					} else {
						issues.push("Missing page title");
					}

					if (input.description) {
						if (input.description.length < 70)
							suggestions.push(
								"Meta description is short — aim for 120-160 characters",
							);
						if (input.description.length > 160)
							issues.push(
								"Meta description is too long (over 160 characters)",
							);
					} else {
						issues.push("Missing meta description");
					}

					if (input.text) {
						const wordCount = input.text.split(/\s+/).length;
						if (wordCount < 300) {
							suggestions.push(
								`Content is ${wordCount} words — aim for 300+ for better SEO`,
							);
						}
					}

					return {
						issues,
						suggestions,
						score:
							issues.length === 0
								? "good"
								: issues.length <= 2
									? "fair"
									: "needs-work",
					};
				},
			},
		},
	});
}

export default createPlugin;
