import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      description: "The category name, like 'Technology' or 'Health'",
      validation: (Rule) => Rule.required().error("Category name is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description:
        "A short paragraph about the category, its importance, or its relevance.",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      category: "category",
      description: "description",
    },
    prepare: ({ category, description }) => {
      // Create a playful subtitle with emojis
      const descriptionPreview = description
        ? `📝 ${description.substring(0, 20)}${description.length > 20 ? "..." : ""}`
        : "📝 No description yet";

      return {
        title: `✍️ ${category || "Unnamed Category"}`,
        subtitle: `${category} | ${descriptionPreview}`,
      };
    },
  },
});
