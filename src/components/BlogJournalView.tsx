import React, { useState } from 'react';
import { BlogPost, filterBlogPosts } from '../utils/bookingLogic';
import { BookOpen, Search, ArrowLeft, ArrowRight } from 'lucide-react';

interface BlogJournalViewProps {
  posts: BlogPost[];
  onNavigateToBooking: () => void;
}

export const BlogJournalView: React.FC<BlogJournalViewProps> = ({
  posts,
  onNavigateToBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const categories = [
    'All',
    'Cabin Engineering',
    'Culinary Heritage',
    'Corridor Guides',
    'Concierge Dispatch',
  ];

  const filteredPosts = filterBlogPosts(posts, selectedCategory, searchQuery);
  const activePost = posts.find((p) => p.id === activePostId) || null;

  if (activePost) {
    return (
      <article className="max-w-[920px] mx-auto px-6 py-12 space-y-8">
        <button
          type="button"
          onClick={() => setActivePostId(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6239] hover:text-[#141413] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to All Overland Journal Dispatches</span>
        </button>

        <header className="space-y-4 border-b border-[#E5DEC9] pb-6">
          <div className="text-xs text-[#8C6239]">
            <span>{activePost.category}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{activePost.publishedDate}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{activePost.readTimeMinutes} min read</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Corridor: {activePost.featuredCorridor}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#141413] leading-tight">
            {activePost.title}
          </h1>

          <p className="text-xs text-[#656059]">
            By <strong className="text-[#141413]">{activePost.author}</strong> ·{' '}
            {activePost.authorRole}
          </p>
        </header>

        <div className="bg-white rounded-xl border border-[#E2DCD0] p-6 sm:p-10 space-y-6">
          <p className="text-base sm:text-lg font-medium text-[#141413] leading-relaxed border-b border-[#EFECE6] pb-6">
            {activePost.excerpt}
          </p>

          <div className="space-y-5 text-sm sm:text-base text-[#36332E] leading-relaxed">
            {activePost.contentParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-[#EFECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#656059]">
              <span className="font-semibold text-[#141413]">Indexed SEO Topics: </span>
              <span>{activePost.seoKeywords.join(' · ')}</span>
            </div>

            <button
              type="button"
              onClick={onNavigateToBooking}
              className="px-5 py-2.5 bg-[#141413] hover:bg-[#292826] text-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Reserve Suite on This Corridor</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DEC9] pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-[#8C6239]">
            The Aurelia Overland Journal · Editorial Blog & SEO Publication
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#141413] leading-tight">
            Dispatches on Indian Luxury Transit, Architecture & Gastronomy.
          </h1>
          <p className="text-sm text-[#4A4640] leading-relaxed">
            In-depth engineering monographs, regional highway corridor guides, and seasonal culinary
            stories curated by our coachbuilders, sommeliers, and terminal directors.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-80">
          <label htmlFor="blog-search" className="block text-xs font-medium text-[#4A4640] mb-1.5">
            Search Journal Dispatches
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#8C857B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="blog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Udaipur, acoustics, Jain menu..."
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#D5CEC2] rounded-lg text-[#141413]"
            />
          </div>
        </div>
      </div>

      {/* Interactive Category Segmented Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F0EA] rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#141413] text-[#FAF8F5]'
                  : 'text-[#5C5852] hover:text-[#141413]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#656059] tabular-nums">
          {filteredPosts.length} Published {filteredPosts.length === 1 ? 'Article' : 'Articles'}
        </span>
      </div>

      {/* Blog Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2DCD0] p-8 text-center space-y-3">
          <p className="text-base font-semibold text-[#141413]">
            No journal articles match your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#141413] text-[#FAF8F5] text-xs font-semibold rounded-lg cursor-pointer"
          >
            Reset Blog Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredPosts.map((post, idx) => (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-[#E2DCD0] p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-[#141413] transition-colors"
            >
              <div className="space-y-3">
                {/* Clean unboxed metadata with typographic separators */}
                <div className="text-xs text-[#656059]">
                  <span className="font-semibold text-[#8C6239]">0{idx + 1}. {post.category}</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span>{post.publishedDate}</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span>{post.readTimeMinutes} min read</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#4A4640] leading-relaxed">{post.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between gap-4">
                <div className="text-xs text-[#656059]">
                  <span className="font-medium text-[#141413]">{post.author}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{post.featuredCorridor}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePostId(post.id)}
                  className="px-4 py-2 bg-[#141413] hover:bg-[#292826] text-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Read Full Article</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
