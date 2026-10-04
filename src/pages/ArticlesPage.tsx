import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  User,
  Share2,
  Check,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Tag,
  Filter,
  FileText
} from 'lucide-react';
import { NavigationTab, ArticleItem } from '../types';
import { subscribeToPublishedArticles } from '../services/firestoreService';
import { INITIAL_ARTICLES } from '../data/initialData';

interface ArticlesPageProps {
  onNavigate: (tab: NavigationTab) => void;
  selectedArticleId?: string | null;
}

export default function ArticlesPage({ onNavigate, selectedArticleId }: ArticlesPageProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(INITIAL_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Real-time subscription to published articles
  useEffect(() => {
    const unsubscribe = subscribeToPublishedArticles((items) => {
      if (items.length > 0) {
        setArticles(items);
      } else {
        setArticles(INITIAL_ARTICLES);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle selectedArticleId prop if passed
  useEffect(() => {
    if (selectedArticleId) {
      const match = articles.find((a) => a.id === selectedArticleId || a.slug === selectedArticleId);
      if (match) {
        setActiveArticle(match);
      }
    }
  }, [selectedArticleId, articles]);

  const categories = [
    { id: 'all', label: 'ހުރިހާ ލިޔުމެއް' },
    { id: 'family', label: 'ޢާއިލާ & ކުދިން' },
    { id: 'ramadan', label: 'ރަމަޟާން' },
    { id: 'youth', label: 'ޒުވާނުން' },
    { id: 'general', label: 'ޢާންމު ހޭލުންތެރިކަން' },
    { id: 'tawheed', label: 'ތައުޙީދު' },
    { id: 'fiqh', label: 'ފިޤުހު' },
    { id: 'seerah', label: 'ސީރަތު' }
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return articles[0] || null;
  }, [articles]);

  const handleCopyShareLink = (article: ArticleItem) => {
    const url = `${window.location.origin}/#/articles?id=${article.slug || article.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('dv-MV', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen font-thaana py-8 sm:py-12 bg-[#FAFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* If Active Article (Reader View) */}
        {activeArticle ? (
          <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5ECE8]">
              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5ECE8] hover:border-[#1B6B52] hover:bg-[#EBF5F0] text-[#1B6B52] font-bold text-sm transition-all shadow-xs"
              >
                <ArrowRight className="w-4 h-4" />
                <span>އެނބުރި ލިޔުންތަކުގެ ލިސްޓަށް</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(activeArticle)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5ECE8] hover:bg-[#FAFCFB] text-[#556660] hover:text-[#1B6B52] text-xs font-bold transition-all shadow-xs"
                  title="ލިންކް ކޮޕީކުރައްވާ"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">ލިންކް ކޮޕީކުރެވިއްޖެ!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>ޙިއްޞާކުރައްވާ (Share)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Article Header & Standardized 16:9 Featured Image */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{activeArticle.categoryLabel || activeArticle.category}</span>
                  </span>
                  {activeArticle.readingTimeMinutes && (
                    <span className="inline-flex items-center gap-1 text-xs text-[#556660]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeArticle.readingTimeMinutes} މިނެޓުގެ ކިޔުމެއް</span>
                    </span>
                  )}
                  {activeArticle.publishedAt && (
                    <span className="inline-flex items-center gap-1 text-xs text-[#556660]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(activeArticle.publishedAt)}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C2622] leading-relaxed tracking-tight">
                  {activeArticle.title}
                </h1>

                {/* Author Card Header */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-11 h-11 rounded-full bg-[#1B6B52] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#1C2622]">{activeArticle.authorName}</h4>
                    <p className="text-xs text-[#556660]">{activeArticle.authorRole || 'ލިޔުންތެރިޔާ'}</p>
                  </div>
                </div>
              </div>

              {/* Standardized 16:9 Featured Image Presentation */}
              <div className="relative aspect-16/9 w-full rounded-3xl overflow-hidden bg-[#0A1612] shadow-xl border border-[#E5ECE8]">
                <img
                  src={activeArticle.featuredImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Excerpt Lead In Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#EBF5F0]/60 border-r-4 border-[#1B6B52] text-[#1C2622] font-semibold text-base sm:text-lg leading-loose shadow-xs">
              {activeArticle.excerpt}
            </div>

            {/* Article Full Body - Rich HTML Support from WYSIWYG or Plaintext */}
            {activeArticle.content && (activeArticle.content.includes('<p') || activeArticle.content.includes('<div') || activeArticle.content.includes('<h') || activeArticle.content.includes('<blockquote')) ? (
              <div
                className="prose prose-lg max-w-none text-[#2A3B34] font-thaana space-y-4 text-base sm:text-lg leading-[2.3] tracking-normal text-right [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1C2622] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1C2622] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#1C2622] [&_p]:my-3 [&_p]:leading-[2.2] [&_blockquote]:border-r-4 [&_blockquote]:border-[#1B6B52] [&_blockquote]:bg-[#EBF5F0]/70 [&_blockquote]:p-5 [&_blockquote]:rounded-2xl [&_blockquote]:font-semibold [&_blockquote]:text-[#1C2622] [&_blockquote]:my-4 [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:my-3 [&_li]:my-1.5 [&_a]:text-[#1B6B52] [&_a]:underline [&_hr]:my-6 [&_hr]:border-[#E5ECE8]"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: activeArticle.content }}
              />
            ) : (
              <div className="prose prose-lg max-w-none text-[#2A3B34] font-thaana space-y-6 text-base sm:text-lg leading-[2.2] tracking-normal text-right" dir="rtl">
                {activeArticle.content.split('\n\n').map((paragraph, idx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                    const items = trimmed.split('\n');
                    return (
                      <ul key={idx} className="list-disc list-inside space-y-2 pr-4 text-[#1C2622] my-4">
                        {items.map((line, lIdx) => (
                          <li key={lIdx} className="leading-relaxed">
                            {line.replace(/^[-•]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  if (/^\d+\./.test(trimmed)) {
                    const items = trimmed.split('\n');
                    return (
                      <ol key={idx} className="list-decimal list-inside space-y-2 pr-4 text-[#1C2622] my-4">
                        {items.map((line, lIdx) => (
                          <li key={lIdx} className="leading-relaxed">
                            {line.replace(/^\d+\.\s*/, '')}
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <p key={idx} className="text-justify leading-loose">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            )}

            {/* Footer of the article */}
            <div className="pt-8 border-t border-[#E5ECE8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-xs">
              <div>
                <span className="text-xs text-[#556660] block mb-1">ލިޔުން ޝާއިޢުކުރެވުނީ:</span>
                <span className="font-bold text-sm text-[#1C2622]">
                  ހެޔޮބިންގާ ޖަމްޢިއްޔާ • ދީނީ އަދި އިޖުތިމާޢީ މީޑިއާ ޔުނިޓް
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyShareLink(activeArticle)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>މި ލިޔުން ޙިއްޞާކުރައްވާ</span>
              </button>
            </div>
          </article>
        ) : (
          /* Public Articles Index / Grid View */
          <>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5ECE8]">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-bold mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>ހެޔޮބިންގާ ޢިލްމީ އަދި ތަރުބަވީ ކަލެކްޝަން</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C2622] tracking-tight">
                  ދީނީ އަދި ޢިލްމީ ލިޔުންތައް (Articles)
                </h1>
                <p className="text-xs sm:text-sm text-[#556660] mt-1 max-w-2xl leading-relaxed">
                  އިސްލާމީ ޢިލްމާއި، ތަރުބިއްޔަތާއި، ޢާއިލާ އަދި މުޖުތަމަޢީ ހޭލުންތެރިކަމަށް ޚާއްޞަ ޢިލްމީ ދިރާސާތަކާއި ލިޔުންތައް.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#556660]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ލިޔުމުގެ ސުރުޚީ، ލިޔުންތެރިޔާ ނުވަތަ މައުޟޫޢު..."
                  className="w-full pr-10 pl-4 py-2.5 bg-white rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs font-thaana shadow-xs"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#1B6B52] text-white shadow-xs'
                        : 'bg-white hover:bg-[#EBF5F0] text-[#556660] hover:text-[#1C2622] border border-[#E5ECE8]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Featured Hero Article Banner (Shown when no active search/filter) */}
            {selectedCategory === 'all' && !searchQuery && featuredArticle && (
              <div
                onClick={() => {
                  setActiveArticle(featuredArticle);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative rounded-3xl overflow-hidden bg-[#0A1612] border border-[#E5ECE8] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* 16:9 Standardized Hero Image */}
                <div className="relative aspect-16/9 sm:aspect-21/9 w-full max-h-[500px]">
                  <img
                    src={featuredArticle.featuredImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-transparent" />
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-[#1B6B52] text-white text-xs font-bold shadow-xs">
                      {featuredArticle.categoryLabel || featuredArticle.category}
                    </span>
                    <span className="text-xs text-white/80 font-mono">
                      {featuredArticle.readingTimeMinutes || 4} Min Read
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors max-w-3xl leading-relaxed">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-white/90 line-clamp-2 max-w-2xl leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-200">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-bold">{featuredArticle.authorName}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:translate-x-[-4px] transition-transform">
                      <span>ވިދާޅުވުމަށް</span>
                      <ChevronLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#556660]">
                <span>ދައްކަނީ: {filteredArticles.length} ލިޔުން</span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#E5ECE8] p-8 space-y-3">
                  <BookOpen className="w-10 h-10 text-[#556660]/50 mx-auto" />
                  <h3 className="font-bold text-lg text-[#1C2622]">އެއްވެސް ލިޔުމެއް ނުފެނުނު</h3>
                  <p className="text-xs text-[#556660]">
                    {searchQuery ? 'ތިޔަ ހޯއްދަވާ މައުޟޫޢަކާ ގުޅޭ ލިޔުމެއް ނުފެނުނެވެ. އެހެން ބަހަކުން ހޯއްދަވާށެވެ.' : 'އަދި އެއްވެސް ލިޔުމެއް ޝާއިޢުކޮށްފައެއް ނުވެއެވެ.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => {
                        setActiveArticle(article);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group bg-white rounded-3xl border border-[#E5ECE8] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                    >
                      <div>
                        {/* Standardized 16:9 Image */}
                        <div className="relative aspect-16/9 w-full bg-[#0A1612] overflow-hidden">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-bold">
                            {article.categoryLabel || article.category}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-2 text-[11px] text-[#556660]">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTimeMinutes || 4} މިނެޓް</span>
                            <span>•</span>
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-[#1C2622] group-hover:text-[#1B6B52] transition-colors line-clamp-2 leading-relaxed">
                            {article.title}
                          </h3>

                          <p className="text-xs text-[#556660] line-clamp-3 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-5 pt-0 border-t border-[#FAFCFB] mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1C2622]">
                          <div className="w-6 h-6 rounded-full bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-[150px]">{article.authorName}</span>
                        </div>

                        <span className="text-xs font-bold text-[#1B6B52] group-hover:underline flex items-center gap-0.5">
                          <span>ވިދާޅުވޭ</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
