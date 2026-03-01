import { defineArrayMember, defineField, defineType } from "sanity";

const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "he", type: "string", title: "Hebrew (he)" }),
    defineField({ name: "en", type: "string", title: "English (en)" }),
  ],
  options: { columns: 2 },
});

const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({ name: "he", type: "text", rows: 3, title: "Hebrew (he)" }),
    defineField({ name: "en", type: "text", rows: 3, title: "English (en)" }),
  ],
});

const localizedSlug = defineType({
  name: "localizedSlug",
  title: "Localized Slug",
  type: "object",
  fields: [
    defineField({ name: "he", type: "slug", title: "Hebrew slug", options: { source: "title.he" } }),
    defineField({ name: "en", type: "slug", title: "English slug", options: { source: "title.en" } }),
  ],
});

const localizedSeo = defineType({
  name: "localizedSeo",
  title: "Localized SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localizedString", title: "Meta title" }),
    defineField({ name: "description", type: "localizedText", title: "Meta description" }),
    defineField({ name: "canonical", type: "localizedString", title: "Canonical path" }),
    defineField({ name: "ogImage", type: "image", title: "Open Graph image" }),
    defineField({ name: "noindex", type: "boolean", initialValue: false }),
  ],
});

const navItem = defineType({
  name: "navItem",
  title: "Navigation Item",
  type: "object",
  fields: [
    defineField({ name: "label", type: "localizedString" }),
    defineField({ name: "href", type: "localizedString", description: "Path like /services" }),
    defineField({ name: "order", type: "number", initialValue: 100 }),
  ],
});

const globalSettings = defineType({
  name: "globalSettings",
  title: "Global Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "localizedString" }),
    defineField({ name: "logo", type: "image" }),
    defineField({ name: "whatsappNumber", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string" }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "supportedLocales",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      initialValue: ["he", "en"],
    }),
    defineField({ name: "defaultLocale", type: "string", initialValue: "he" }),
  ],
});

const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "navItem" })] }),
    defineField({ name: "primaryCtaLabel", type: "localizedString" }),
    defineField({ name: "primaryCtaHref", type: "localizedString" }),
    defineField({ name: "secondaryCtaLabel", type: "localizedString" }),
    defineField({ name: "secondaryCtaHref", type: "localizedString" }),
  ],
});

const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", type: "localizedString" }),
    defineField({ name: "heroTitle", type: "localizedString" }),
    defineField({ name: "heroDescription", type: "localizedText" }),
    defineField({ name: "heroTrust", type: "localizedText" }),
    defineField({ name: "heroPrimaryCta", type: "localizedString" }),
    defineField({ name: "heroSecondaryCta", type: "localizedString" }),
    defineField({ name: "whoTitle", type: "localizedString" }),
    defineField({ name: "whoDescription", type: "localizedText" }),
    defineField({ name: "howTitle", type: "localizedString" }),
    defineField({ name: "howDescription", type: "localizedText" }),
    defineField({ name: "benefitsTitle", type: "localizedString" }),
    defineField({ name: "benefitsDescription", type: "localizedText" }),
    defineField({ name: "ctaTitle", type: "localizedString" }),
    defineField({ name: "ctaDescription", type: "localizedText" }),
  ],
});

const pageContent = defineType({
  name: "pageContent",
  title: "Static Page Content",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      type: "string",
      options: {
        list: ["services", "solutions", "pricing", "portfolio", "about", "contact"],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "eyebrow", type: "localizedString" }),
    defineField({ name: "title", type: "localizedString" }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "seo", type: "localizedSeo" }),
  ],
});

const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "localizedSlug", validation: (rule) => rule.required() }),
    defineField({ name: "subtitle", type: "localizedString" }),
    defineField({ name: "shortValue", type: "localizedString" }),
    defineField({ name: "shortDescription", type: "localizedText" }),
    defineField({ name: "fullDescription", type: "localizedText" }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["photography", "videography", "reels-ugc", "editing", "content-day", "social-pack", "other"],
      },
    }),
    defineField({
      name: "cardType",
      type: "string",
      options: {
        list: [
          { title: "Standard Service", value: "standard" },
          { title: "Business Solution", value: "solution" },
        ],
      },
      initialValue: "standard",
    }),
    defineField({ name: "deliverables", type: "array", of: [defineArrayMember({ type: "localizedString" })] }),
    defineField({ name: "deliveryTime", type: "localizedString" }),
    defineField({ name: "priceFrom", type: "string" }),
    defineField({ name: "featuredImage", type: "image" }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "image" })] }),
    defineField({ name: "faq", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "faqItem" }] })] }),
    defineField({ name: "seo", type: "localizedSeo" }),
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 100 }),
  ],
});

const solution = defineType({
  name: "solution",
  title: "Solution",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "localizedSlug", validation: (rule) => rule.required() }),
    defineField({ name: "problem", type: "localizedText" }),
    defineField({ name: "outcome", type: "localizedText" }),
    defineField({ name: "includedItems", type: "array", of: [defineArrayMember({ type: "localizedString" })] }),
    defineField({ name: "deliveryTime", type: "localizedString" }),
    defineField({ name: "priceFrom", type: "string" }),
    defineField({ name: "visuals", type: "array", of: [defineArrayMember({ type: "image" })] }),
    defineField({ name: "seo", type: "localizedSeo" }),
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 100 }),
  ],
});

const packageType = defineType({
  name: "package",
  title: "Package",
  type: "document",
  fields: [
    defineField({ name: "name", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "summary", type: "localizedText" }),
    defineField({ name: "whoFor", type: "localizedString" }),
    defineField({ name: "features", type: "array", of: [defineArrayMember({ type: "localizedString" })] }),
    defineField({ name: "limits", type: "localizedText" }),
    defineField({ name: "price", type: "string" }),
    defineField({ name: "ctaLabel", type: "localizedString" }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
    defineField({ name: "displayOrder", type: "number", initialValue: 100 }),
    defineField({ name: "seo", type: "localizedSeo" }),
  ],
});

const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Portfolio Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "clientType", type: "localizedString" }),
    defineField({
      name: "media",
      type: "array",
      of: [defineArrayMember({ type: "image" }), defineArrayMember({ type: "file" })],
    }),
    defineField({ name: "shortDescription", type: "localizedText" }),
    defineField({ name: "tags", type: "array", of: [defineArrayMember({ type: "localizedString" })] }),
    defineField({ name: "displayOrder", type: "number", initialValue: 100 }),
  ],
});

const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "business", type: "string" }),
    defineField({ name: "quote", type: "localizedText" }),
    defineField({ name: "rating", type: "number", validation: (rule) => rule.min(1).max(5) }),
    defineField({ name: "visible", type: "boolean", initialValue: true }),
  ],
});

const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({ name: "question", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "answer", type: "localizedText", validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "displayOrder", type: "number", initialValue: 100 }),
  ],
});

const lead = defineType({
  name: "lead",
  title: "Lead Submission",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "business", type: "string" }),
    defineField({ name: "message", type: "text", rows: 4 }),
    defineField({ name: "locale", type: "string" }),
    defineField({ name: "sourcePath", type: "string" }),
    defineField({ name: "createdAt", type: "datetime" }),
  ],
});

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedSlug,
  localizedSeo,
  navItem,
  globalSettings,
  navigation,
  homePage,
  pageContent,
  service,
  solution,
  packageType,
  portfolioProject,
  testimonial,
  faqItem,
  lead,
];
