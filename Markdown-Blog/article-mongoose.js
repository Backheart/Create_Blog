import mongoose from "mongoose";
import slugify from "slugify";
import { marked } from "marked";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
const domPurify = createDomPurify(new JSDOM().window);  

const articleSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true 
    },
    markdown: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    sanitizedHtml: {
      type: String,
      required: true
    }
});
articleSchema.pre("validate", async function(next) {
  if (this.title) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let i = 1;

    // Check for existing slug and append suffix until unique
    while (await mongoose.models.Article.exists({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${i++}`;
    }

    this.slug = uniqueSlug;

    if (this.markdown) {
      this.sanitizedHtml = domPurify.sanitize(marked(this.markdown));
    }
  }
  next();
});
export default mongoose.model("Article", articleSchema);