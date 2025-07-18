/* eslint-disable prettier/prettier */
import { notFound } from "next/navigation";

import { BlogCard, BlogHeader, FeaturedBlogCard } from "@/components/blog-card";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";

async function fetchBlogPosts() {
  return await handleErrors(sanityFetch({ query: queryBlogIndexPageData }));
}

export async function generateMetadata() {
  const { data: result } = await sanityFetch({
    query: queryBlogIndexPageData,
    stega: false,
  });
  return getSEOMetadata(
    result
      ? {
          title: result?.title ?? result?.seoTitle ?? "",
          description: result?.description ?? result?.seoDescription ?? "",
          slug: result?.slug,
          contentId: result?._id,
          contentType: result?._type,
        }
      : {},
  );
}

export default async function BlogIndexPage() {
  const [res, err] = await fetchBlogPosts();
  if (err || !res?.data) notFound();

  const {
    blogs = [],
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
    displayFeaturedBlogs,
    featuredBlogsCount,
  } = res.data;

  const validFeaturedBlogsCount = featuredBlogsCount
    ? Number.parseInt(featuredBlogsCount)
    : 0;

  if (!blogs.length) {
    return (
      <main className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No blog posts available at the moment.
          </p>
        </div>
        {pageBuilder && pageBuilder.length > 0 && (
          <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
        )}
      </main>
    );
  }

  const shouldDisplayFeaturedBlogs =
    displayFeaturedBlogs && validFeaturedBlogsCount > 0;

  const featuredBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(0, validFeaturedBlogsCount)
    : [];
  const remainingBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(validFeaturedBlogsCount)
    : blogs;

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />

        {featuredBlogs.length > 0 && (
          <div className="mx-auto mt-8 sm:mt-12 md:mt-16 mb-12 lg:mb-20 grid grid-cols-1 gap-8 md:gap-12">
            {featuredBlogs.map(
              (blog: {
                _type: "blog";
                _id: string;
                title: string | null;
                description: string | null;
                slug: string | null;
                richText: import("@/lib/sanity/sanity.types").RichText | null;
                orderRank: string | null;
                image:
                  | {
                      asset?: {
                        _ref: string;
                        _type: "reference";
                        _weak?: boolean;
                        [key: string]: any;
                      };
                      media?: unknown;
                      hotspot?: import("@/lib/sanity/sanity.types").SanityImageHotspot;
                      crop?: import("@/lib/sanity/sanity.types").SanityImageCrop;
                      _type: "image";
                      alt: string | "no-alt";
                      blurData: string | null;
                      dominantColor: string | null;
                    }
                  | {
                      asset?: {
                        _ref: string;
                        _type: "reference";
                        _weak?: boolean;
                        [key: string]: any;
                      };
                      media?: unknown;
                      hotspot?: import("@/lib/sanity/sanity.types").SanityImageHotspot;
                      crop?: import("@/lib/sanity/sanity.types").SanityImageCrop;
                      _type: "image";
                    }
                  | null;
                publishedAt: string | null;
                authors: any | null;
                categories: any | null;
              }) => (
                <FeaturedBlogCard key={blog._id} blog={blog} />
              ),
            )}
          </div>
        )}

        {remainingBlogs.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 mt-8">
            {remainingBlogs.map(
              (blog: {
                _type: "blog";
                _id: string;
                title: string | null;
                description: string | null;
                slug: string | null;
                richText: import("@/lib/sanity/sanity.types").RichText | null;
                orderRank: string | null;
                image:
                  | {
                      asset?: {
                        _ref: string;
                        _type: "reference";
                        _weak?: boolean;
                        [key: string]: any;
                      };
                      media?: unknown;
                      hotspot?: import("@/lib/sanity/sanity.types").SanityImageHotspot;
                      crop?: import("@/lib/sanity/sanity.types").SanityImageCrop;
                      _type: "image";
                      alt: string | "no-alt";
                      blurData: string | null;
                      dominantColor: string | null;
                    }
                  | {
                      asset?: {
                        _ref: string;
                        _type: "reference";
                        _weak?: boolean;
                        [key: string]: any;
                      };
                      media?: unknown;
                      hotspot?: import("@/lib/sanity/sanity.types").SanityImageHotspot;
                      crop?: import("@/lib/sanity/sanity.types").SanityImageCrop;
                      _type: "image";
                    }
                  | null;
                publishedAt: string | null;
                authors: any | null;
                categories: any | null;
              }) => (
                <BlogCard key={blog._id} blog={blog} />
              ),
            )}
          </div>
        )}
      </div>

      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )}
    </main>
  );
}
