import type { Element } from "@emdash-cms/blocks";
import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

export const BUSINESS_BLOCK_TYPES = [
	"business.hero",
	"business.features",
	"business.testimonials",
	"business.pricing",
	"business.faq",
	"business.gallery",
	"business.map",
	"business.cta",
	"business.team",
	"business.hours",
	"business.contact-info",
	"business.stats",
] as const;

export type BusinessBlockType = (typeof BUSINESS_BLOCK_TYPES)[number];

const BLOCK_META: Record<
	string,
	{
		label: string;
		icon?: string;
		description?: string;
		fields?: Element[];
	}
> = {
	"business.hero": {
		label: "Hero Section",
		icon: "layout",
		description: "Full-width hero with headline, subheadline, and CTA buttons",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
			{ type: "text_input", action_id: "subheadline", label: "Subheadline" },
			{ type: "text_input", action_id: "primaryCta.label", label: "Primary CTA Label" },
			{ type: "text_input", action_id: "primaryCta.url", label: "Primary CTA URL" },
			{ type: "text_input", action_id: "secondaryCta.label", label: "Secondary CTA Label" },
			{ type: "text_input", action_id: "secondaryCta.url", label: "Secondary CTA URL" },
			{
				type: "select",
				action_id: "style",
				label: "Layout Style",
				options: [
					{ text: "Split (text + image)", value: "split" },
					{ text: "Centered", value: "centered" },
				],
			},
		],
	},
	"business.features": {
		label: "Features Grid",
		icon: "grid-four",
		description: "Grid of feature cards with icons, titles, and descriptions",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
			{ type: "text_input", action_id: "subheadline", label: "Subheadline" },
		],
	},
	"business.testimonials": {
		label: "Testimonials",
		icon: "quotes",
		description: "Customer testimonials with quotes, names, and ratings",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
		],
	},
	"business.pricing": {
		label: "Pricing Table",
		icon: "currency-dollar",
		description: "Pricing plans with features and CTAs",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
		],
	},
	"business.faq": {
		label: "FAQ Section",
		icon: "question",
		description: "Expandable FAQ accordion",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
		],
	},
	"business.gallery": {
		label: "Image Gallery",
		icon: "images",
		description: "Image gallery with grid, masonry, or carousel layout",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
			{
				type: "select",
				action_id: "layout",
				label: "Layout",
				options: [
					{ text: "Grid", value: "grid" },
					{ text: "Masonry", value: "masonry" },
					{ text: "Carousel", value: "carousel" },
				],
			},
			{
				type: "select",
				action_id: "columns",
				label: "Columns",
				options: [
					{ text: "2", value: "2" },
					{ text: "3", value: "3" },
					{ text: "4", value: "4" },
				],
			},
		],
	},
	"business.map": {
		label: "Map",
		icon: "map-pin",
		description: "Embedded map with address and marker",
		fields: [
			{ type: "text_input", action_id: "address", label: "Address" },
			{ type: "text_input", action_id: "lat", label: "Latitude" },
			{ type: "text_input", action_id: "lng", label: "Longitude" },
			{ type: "text_input", action_id: "zoom", label: "Zoom Level", placeholder: "15" },
			{ type: "text_input", action_id: "markerTitle", label: "Marker Title" },
			{ type: "text_input", action_id: "height", label: "Height", placeholder: "400px" },
		],
	},
	"business.cta": {
		label: "Call to Action",
		icon: "megaphone",
		description: "Call-to-action banner with headline and button",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
			{ type: "text_input", action_id: "description", label: "Description" },
			{ type: "text_input", action_id: "buttonLabel", label: "Button Label" },
			{ type: "text_input", action_id: "buttonUrl", label: "Button URL" },
			{
				type: "select",
				action_id: "style",
				label: "Style",
				options: [
					{ text: "Banner (full-width)", value: "banner" },
					{ text: "Card", value: "card" },
					{ text: "Inline", value: "inline" },
				],
			},
		],
	},
	"business.team": {
		label: "Team Grid",
		icon: "users-three",
		description: "Team member cards with photos and bios",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
		],
	},
	"business.hours": {
		label: "Business Hours",
		icon: "clock",
		description: "Business hours table",
		fields: [
			{ type: "text_input", action_id: "headline", label: "Headline" },
		],
	},
	"business.contact-info": {
		label: "Contact Info",
		icon: "address-book",
		description: "Contact details with phone, email, address, and social links",
		fields: [
			{ type: "text_input", action_id: "phone", label: "Phone" },
			{ type: "text_input", action_id: "email", label: "Email" },
			{ type: "text_input", action_id: "address", label: "Address" },
		],
	},
	"business.stats": {
		label: "Stats / Numbers",
		icon: "chart-bar",
		description: "Row of statistics or key metrics",
	},
};

export interface BusinessBlocksOptions {
	types?: Array<(typeof BUSINESS_BLOCK_TYPES)[number]>;
}

export function businessBlocksPlugin(
	options: BusinessBlocksOptions = {},
): PluginDescriptor<BusinessBlocksOptions> {
	return {
		id: "business-blocks",
		version: "0.1.0",
		entrypoint: "@emdash-cms/plugin-business-blocks",
		componentsEntry: "@emdash-cms/plugin-business-blocks/astro",
		options,
	};
}

export function createPlugin(options: BusinessBlocksOptions = {}): ResolvedPlugin {
	const enabledTypes = options.types ?? [...BUSINESS_BLOCK_TYPES];

	return definePlugin({
		id: "business-blocks",
		version: "0.1.0",
		capabilities: [],
		admin: {
			portableTextBlocks: enabledTypes.map((type) => {
				const meta = BLOCK_META[type];
				return {
					type,
					label: meta?.label ?? type,
					icon: meta?.icon,
					description: meta?.description,
					fields: meta?.fields,
				};
			}),
		},
	});
}

export default createPlugin;
