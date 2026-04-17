import CTAComponent from "./CTA.astro";
import ContactInfoComponent from "./ContactInfo.astro";
import FAQComponent from "./FAQ.astro";
import FeaturesComponent from "./Features.astro";
import GalleryComponent from "./Gallery.astro";
import HeroComponent from "./Hero.astro";
import HoursComponent from "./Hours.astro";
import MapComponent from "./Map.astro";
import PricingComponent from "./Pricing.astro";
import StatsComponent from "./Stats.astro";
import TeamComponent from "./Team.astro";
import TestimonialsComponent from "./Testimonials.astro";

// Export with block type names for auto-registration
export {
	HeroComponent as "business.hero",
	FeaturesComponent as "business.features",
	TestimonialsComponent as "business.testimonials",
	PricingComponent as "business.pricing",
	FAQComponent as "business.faq",
	GalleryComponent as "business.gallery",
	MapComponent as "business.map",
	CTAComponent as "business.cta",
	TeamComponent as "business.team",
	HoursComponent as "business.hours",
	ContactInfoComponent as "business.contact-info",
	StatsComponent as "business.stats",
};

export const blockComponents = {
	"business.hero": HeroComponent,
	"business.features": FeaturesComponent,
	"business.testimonials": TestimonialsComponent,
	"business.pricing": PricingComponent,
	"business.faq": FAQComponent,
	"business.gallery": GalleryComponent,
	"business.map": MapComponent,
	"business.cta": CTAComponent,
	"business.team": TeamComponent,
	"business.hours": HoursComponent,
	"business.contact-info": ContactInfoComponent,
	"business.stats": StatsComponent,
} as const;
