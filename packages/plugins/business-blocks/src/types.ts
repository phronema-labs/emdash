export interface HeroBlock {
	_type: "business.hero";
	_key: string;
	headline: string;
	subheadline?: string;
	primaryCta?: { label: string; url: string };
	secondaryCta?: { label: string; url: string };
	image?: { url: string; alt?: string };
	style?: "split" | "centered";
}

export interface FeatureItem {
	icon: string;
	title: string;
	description: string;
}

export interface FeaturesBlock {
	_type: "business.features";
	_key: string;
	headline?: string;
	subheadline?: string;
	features: FeatureItem[];
}

export interface TestimonialItem {
	quote: string;
	author: string;
	role?: string;
	company?: string;
	avatar?: string;
	rating?: number;
}

export interface TestimonialsBlock {
	_type: "business.testimonials";
	_key: string;
	headline?: string;
	testimonials: TestimonialItem[];
}

export interface PricingPlan {
	name: string;
	price: string;
	period?: string;
	description?: string;
	features: string[];
	cta: { label: string; url: string };
	highlighted?: boolean;
}

export interface PricingBlock {
	_type: "business.pricing";
	_key: string;
	headline?: string;
	plans: PricingPlan[];
}

export interface FAQItem {
	question: string;
	answer: string;
}

export interface FAQBlock {
	_type: "business.faq";
	_key: string;
	headline?: string;
	items: FAQItem[];
}

export interface GalleryImage {
	src: string;
	alt?: string;
	caption?: string;
}

export interface GalleryBlock {
	_type: "business.gallery";
	_key: string;
	headline?: string;
	images: GalleryImage[];
	layout?: "grid" | "masonry" | "carousel";
	columns?: number;
}

export interface MapBlock {
	_type: "business.map";
	_key: string;
	address: string;
	lat: number;
	lng: number;
	zoom?: number;
	markerTitle?: string;
	height?: string;
}

export interface CTABlock {
	_type: "business.cta";
	_key: string;
	headline: string;
	description?: string;
	buttonLabel: string;
	buttonUrl: string;
	style?: "banner" | "card" | "inline";
}

export interface TeamMember {
	name: string;
	role?: string;
	photo?: string;
	bio?: string;
	social?: Record<string, string>;
}

export interface TeamBlock {
	_type: "business.team";
	_key: string;
	headline?: string;
	members: TeamMember[];
}

export interface BusinessHour {
	day: string;
	open?: string;
	close?: string;
	closed?: boolean;
}

export interface HoursBlock {
	_type: "business.hours";
	_key: string;
	headline?: string;
	hours: BusinessHour[];
}

export interface SocialLink {
	platform: string;
	url: string;
}

export interface ContactInfoBlock {
	_type: "business.contact-info";
	_key: string;
	phone?: string;
	email?: string;
	address?: string;
	social?: SocialLink[];
}

export interface StatItem {
	value: string;
	label: string;
	description?: string;
}

export interface StatsBlock {
	_type: "business.stats";
	_key: string;
	stats: StatItem[];
}

export type BusinessBlock =
	| HeroBlock
	| FeaturesBlock
	| TestimonialsBlock
	| PricingBlock
	| FAQBlock
	| GalleryBlock
	| MapBlock
	| CTABlock
	| TeamBlock
	| HoursBlock
	| ContactInfoBlock
	| StatsBlock;
