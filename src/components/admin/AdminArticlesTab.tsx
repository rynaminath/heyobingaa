import React, { useState, useRef } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  AlertCircle,
  Clock,
  User,
  UploadCloud,
  Crop,
  Search,
  Check,
  Send,
  RotateCcw,
  Sparkles,
  Eye,
  Tag
} from 'lucide-react';
import ImageCropperModal from '../ImageCropperModal';
import WysiwygEditor from './WysiwygEditor';
import { ArticleItem, AuthorProfile, ArticleStatus } from '../../types';

interface AdminArticlesTabProps {
  articles: ArticleItem[];
  authors: AuthorProfile[];
  isAdmin: boolean;
  isAuthor: boolean;
  authorProfile: AuthorProfile | null;
  currentUserId: string;
  currentUserEmail: string;
  actionLoading: boolean;
  onSaveArticle: (article: ArticleItem) => Promise<void>;
  onApproveAndPublish: (articleId: string, customAuthorName?: string) => Promise<void>;
  onRejectArticle: (articleId: string, reason: string) => Promise<void>;
  onDeleteArticle: (articleId: string) => Promise<void>;
}

export default function AdminArticlesTab({
  articles,
  authors,
  isAdmin,
  isAuthor,
  authorProfile,
  currentUserId,
  currentUserEmail,
  actionLoading,
  onSaveArticle,
  onApproveAndPublish,
  onRejectArticle,
  onDeleteArticle
}: AdminArticlesTabProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArticle, setEditingArticle] = useState<Partial<ArticleItem> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 16:9 Image Cropper state for featured image
  const [articleCropData, setArticleCropData] = useState<{ src: string; filename: string } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Rejection modal state
  const [rejectingArticle, setRejectingArticle] = useState<ArticleItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter articles based on user role: Authors only see their articles
  const roleFilteredArticles = articles.filter((art) => {
    if (isAdmin) return true;
    return art.authorId === currentUserId || art.authorEmail === currentUserEmail;
  });

  const displayedArticles = roleFilteredArticles.filter((art) => {
    const matchStatus = filterStatus === 'all' || art.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.authorName.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const pendingCount = roleFilteredArticles.filter((a) => a.status === 'pending_approval').length;

  // Open Add Article Modal
  const handleOpenAddModal = () => {
    setFormError(null);
    const defaultAuthorName = isAdmin
      ? 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު'
      : authorProfile?.name || 'ލިޔުންތެރިޔާ';

    setEditingArticle({
      id: `art-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1280&h=720&q=80',
      category: 'general',
      categoryLabel: 'ޢާންމު ހޭލުންތެރިކަން',
      authorId: currentUserId,
      authorEmail: currentUserEmail,
      authorName: defaultAuthorName,
      authorRole: isAdmin ? 'ދީނީ & އިޖުތިމާޢީ ޔުނިޓް' : authorProfile?.title || 'ލިޔުންތެރިޔާ',
      status: isAdmin ? 'published' : 'pending_approval',
      readingTimeMinutes: 4,
      createdAt: new Date().toISOString()
    });
  };

  // Image File selection -> Launch 16:9 Cropper
  const handleFileFor16x9Crop = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('ހަމައެކަނި ފޮޓޯ ފައިލް (JPG, PNG, WebP) އަޕްލޯޑްކުރެއްވޭނެއެވެ.');
      return;
    }
    setFormError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setArticleCropData({
          src: e.target.result as string,
          filename: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // When 16:9 crop completes
  const handleCropComplete = (croppedDataUrl: string) => {
    setArticleCropData(null);
    if (editingArticle) {
      setEditingArticle({
        ...editingArticle,
        featuredImage: croppedDataUrl
      });
    }
  };

  // Save Article
  const handleSave = async (targetStatus?: ArticleStatus) => {
    if (!editingArticle?.title || !editingArticle?.excerpt || !editingArticle?.content || !editingArticle?.featuredImage) {
      setFormError('ކޮންމެހެން ފުރަންޖެހޭ ބައިތައް (ސުރުޚީ، ޚުލާޞާ، ލިޔުމުގެ ބޮޑީ، ފީޗާރޑް އިމޭޖް) ފުރިހަމަކުރައްވާ');
      return;
    }
    setFormError(null);

    const categoryLabels: Record<string, string> = {
      family: 'ޢާއިލާ & ކުދިން',
      ramadan: 'ރަމަޟާން',
      youth: 'ޒުވާނުން',
      general: 'ޢާންމު ހޭލުންތެރިކަން',
      tawheed: 'ތައުޙީދު',
      fiqh: 'ފިޤުހު',
      seerah: 'ސީރަތު'
    };

    const finalStatus: ArticleStatus = targetStatus || editingArticle.status || (isAdmin ? 'published' : 'pending_approval');

    const payload: ArticleItem = {
      id: editingArticle.id || `art-${Date.now()}`,
      title: editingArticle.title.trim(),
      slug: editingArticle.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0780-\u07BF]+/g, '-')
        .replace(/^-|-$/g, '') || `art-${Date.now()}`,
      excerpt: editingArticle.excerpt.trim(),
      content: editingArticle.content.trim(),
      featuredImage: editingArticle.featuredImage,
      category: (editingArticle.category as any) || 'general',
      categoryLabel: categoryLabels[editingArticle.category || 'general'] || 'ޢާންމު',
      authorId: editingArticle.authorId || currentUserId,
      authorEmail: editingArticle.authorEmail || currentUserEmail,
      authorName: editingArticle.authorName?.trim() || (authorProfile?.name || 'ލިޔުންތެރިޔާ'),
      authorRole: editingArticle.authorRole?.trim() || 'ލިޔުންތެރިޔާ',
      status: finalStatus,
      publishedAt: finalStatus === 'published' ? (editingArticle.publishedAt || new Date().toISOString()) : undefined,
      createdAt: editingArticle.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readingTimeMinutes: Number(editingArticle.readingTimeMinutes) || 4,
      approvedBy: finalStatus === 'published' && isAdmin ? currentUserId : editingArticle.approvedBy,
      approvedAt: finalStatus === 'published' && isAdmin ? new Date().toISOString() : editingArticle.approvedAt
    };

    await onSaveArticle(payload);
    setEditingArticle(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectingArticle) return;
    await onRejectArticle(rejectingArticle.id, rejectionReason || 'އަލުން މުރާޖަޢާކުރުމަށްފަހު ފޮނުއްވާށެވެ.');
    setRejectingArticle(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 font-thaana">
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E5ECE8] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>
              {isAdmin ? 'އެޑްމިން ލިޔުންތަކުގެ ޕެނަލް (Admin Articles)' : 'ލިޔުންތެރިޔާގެ ޕޯޓަލް (Author Portal)'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2622]">
            {isAdmin ? 'ލިޔުންތައް ބެލެހެއްޓެވުމާއި ޝާއިޢުކުރުން' : 'އަޅުގަނޑުގެ ލިޔުންތައް'} ({roleFilteredArticles.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#556660] mt-1 max-w-2xl leading-relaxed">
            {isAdmin
              ? 'ލިޔުންތެރިން ފޮނުވާފައިވާ ލިޔުންތައް ރިވިއުކޮށް އެޕްރޫވްކުރުން، ނުވަތަ އެޑްމިނުން އަމިއްލައަށް ކޮންމެ ލިޔުންތެރިއެއްގެ ނަމުގައިވެސް ލިޔުން ލިޔެ ވަގުތުން ޝާއިޢުކުރުން.'
              : 'އައު ލިޔުމެއް ލިޔުއްވައި، 16:9 ފީޗާރޑް އިމޭޖް އަޅުއްވައި އެޑްމިން އެޕްރޫވަލްއަށް ފޮނުއްވާ.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>އައު ލިޔުމެއް ލިޔުއްވާ</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#1B6B52] text-white shadow-xs'
                : 'bg-white hover:bg-[#EBF5F0] text-[#556660] border border-[#E5ECE8]'
            }`}
          >
            ހުރިހާ ({roleFilteredArticles.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('pending_approval')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterStatus === 'pending_approval'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span>އެޕްރޫވަލްއަށް އެދިފައި ({pendingCount})</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('published')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterStatus === 'published'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-[#E5ECE8]'
            }`}
          >
            ޝާއިޢުކުރެވިފައި
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('draft')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterStatus === 'draft'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-[#E5ECE8]'
            }`}
          >
            ޑްރާފްޓް
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('rejected')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterStatus === 'rejected'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-rose-700 border border-[#E5ECE8]'
            }`}
          >
            އަލުން މުރާޖަޢާކުރުމަށް
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#556660]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ލިޔުމުގެ ސުރުޚީ ނުވަތަ ލިޔުންތެރިޔާ..."
            className="w-full pr-9 pl-3 py-1.5 bg-white rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs font-thaana"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedArticles.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#556660] bg-white rounded-3xl border border-[#E5ECE8]">
            އެއްވެސް ލިޔުމެއް ނުފެނުނެވެ.
          </div>
        ) : (
          displayedArticles.map((art) => {
            const isPending = art.status === 'pending_approval';
            const isPublished = art.status === 'published';
            const isRejected = art.status === 'rejected';

            return (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-[#E5ECE8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Standardized 16:9 Image Thumbnail */}
                  <div className="relative aspect-16/9 w-full bg-[#0A1612]">
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {art.categoryLabel || art.category}
                      </span>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs ${
                          isPublished
                            ? 'bg-emerald-600 text-white'
                            : isPending
                            ? 'bg-amber-500 text-white animate-pulse'
                            : isRejected
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-600 text-white'
                        }`}
                      >
                        {isPublished
                          ? 'ޝާއިޢުކުރެވިފައި'
                          : isPending
                          ? 'އެޕްރޫވަލްއަށް އެދިފައި'
                          : isRejected
                          ? 'މުރާޖަޢާކުރުމަށް'
                          : 'ޑްރާފްޓް'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#556660]">
                      <User className="w-3.5 h-3.5 text-[#1B6B52]" />
                      <span className="font-bold text-[#1C2622]">{art.authorName}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{art.readingTimeMinutes || 4} މިނެޓް</span>
                    </div>

                    <h3 className="font-bold text-base text-[#1C2622] line-clamp-2 leading-relaxed">
                      {art.title}
                    </h3>

                    <p className="text-xs text-[#556660] line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>

                    {/* Rejection notice if rejected */}
                    {isRejected && art.rejectionReason && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                        <span className="font-bold block mb-0.5">އިޞްލާޙުކުރަންވީ ބައި:</span>
                        <span>{art.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 space-y-2 border-t border-[#FAFCFB] mt-2">
                  {/* Admin Approval Quick Action Button */}
                  {isAdmin && isPending && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => onApproveAndPublish(art.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="އެޕްރޫވްކޮށް ވަގުތުން ޝާއިޢުކުރައްވާ"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>އެޕްރޫވް & ޝާއިޢު</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectingArticle(art)}
                        className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                        title="އަލުން މުރާޖަޢާކުރުމަށް ފޮނުއްވާ"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>މުރާޖަޢާއަށް</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingArticle(art)}
                      className="p-1.5 rounded-lg hover:bg-[#EBF5F0] text-[#1B6B52] transition-colors cursor-pointer"
                      title="އިސްލާޙުކުރައްވާ"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {(isAdmin || art.authorId === currentUserId) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('މި ލިޔުން ފޮހެލަން ބޭނުންފުޅުތޯ؟')) {
                            onDeleteArticle(art.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                        title="ފޮހެލައްވާ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- ARTICLE EDIT / CREATE MODAL --- */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-5 my-8 max-h-[94vh] overflow-y-auto font-thaana shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5ECE8] pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1C2622]">
                  {editingArticle.id && articles.some((a) => a.id === editingArticle.id)
                    ? 'ލިޔުން އިޞްލާޙުކުރައްވާ'
                    : 'އައު ލިޔުމެއް ލިޔުއްވާ'}
                </h3>
                <p className="text-xs text-[#556660] mt-0.5">
                  ހުރިހާ ލިޔުމެއްގެ ފީޗާރޑް އިމޭޖް ހުންނާނީ 16:9 ސްޓޭންޑަޑް ސައިޒުގައެވެ.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="p-1 hover:bg-[#FAFCFB] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-[#556660]" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ލިޔުމުގެ ސުރުޚީ (Article Title) *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => {
                    setFormError(null);
                    setEditingArticle({ ...editingArticle, title: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none font-bold text-sm"
                  placeholder="ސުރުޚީ ލިޔުއްވާ..."
                />
              </div>

              {/* Category & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ކެޓަގަރީ (Category) *</label>
                  <select
                    value={editingArticle.category || 'general'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none bg-white text-xs font-bold"
                  >
                    <option value="general">ޢާންމު ހޭލުންތެރިކަން</option>
                    <option value="family">ޢާއިލާ & ކުދިން</option>
                    <option value="ramadan">ރަމަޟާން</option>
                    <option value="youth">ޒުވާނުން</option>
                    <option value="tawheed">ތައުޙީދު & އަޤީދާ</option>
                    <option value="fiqh">ފިޤުހު & އަޅުކަން</option>
                    <option value="seerah">ސީރަތު</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">
                    ކިޔަން ނަގާ ވަގުތު މިނެޓުން (Read Time)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={editingArticle.readingTimeMinutes || 4}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, readingTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Author Name Selection / Custom Input */}
              {/* "admins can also create articles, have a different Author name so it can be published." */}
              <div className="p-4 rounded-2xl bg-[#FAFCFB] border border-[#E5ECE8] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1C2622]">
                    ލިޔުންތެރިޔާގެ ނަން (Published Author Name) *
                  </label>
                  {isAdmin && (
                    <span className="text-[11px] font-bold text-[#1B6B52] bg-[#EBF5F0] px-2 py-0.5 rounded-md">
                      އެޑްމިން: ކޮންމެ ނަމެއްވެސް ޖެއްސެވޭނެ
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={editingArticle.authorName || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, authorName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs font-bold"
                      placeholder="މިސާލަކަށް: އައްޝައިޚް ޢަބްދުއްސަލާމް ދާއޫދު"
                    />
                  </div>
                  <div>
                    {isAdmin && authors.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const found = authors.find((a) => a.name === e.target.value);
                            setEditingArticle({
                              ...editingArticle,
                              authorName: e.target.value,
                              authorRole: found?.title || editingArticle.authorRole
                            });
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none bg-white text-xs"
                        defaultValue=""
                      >
                        <option value="" disabled>ދަފްތަރުން ލިޔުންތެރިއަކު ނަންގަވާ...</option>
                        {authors.map((a) => (
                          <option key={a.id} value={a.name}>
                            {a.name} ({a.title})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={editingArticle.authorRole || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, authorRole: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-[11px] text-[#556660]"
                  placeholder="ލިޔުންތެރިޔާގެ ލަޤަބު (މިސާލަކަށް: ދީނީ ޢިލްމުވެރިޔާ / މުދައްރިސް)"
                />
              </div>

              {/* Standardized 16:9 Featured Image Upload with Crop Option */}
              {/* "articles should have a featured image (on upload, give option to crop to 16:9 and let it be the only size so that it will be standardised." */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1C2622]">
                    ފީޗާރޑް އިމޭޖް (Featured Image - 16:9 ސްޓޭންޑަޑް) *
                  </label>
                  <span className="text-[11px] font-mono text-[#1B6B52] font-bold">16:9 Aspect Ratio</span>
                </div>

                {/* Drag and Drop / File upload zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileFor16x9Crop(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => modalFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    isDraggingOver
                      ? 'border-[#1B6B52] bg-[#EBF5F0]'
                      : 'border-[#C8E0D5] hover:border-[#1B6B52] bg-[#FAFCFB] hover:bg-[#EBF5F0]/50'
                  }`}
                >
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileFor16x9Crop(e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="flex items-center justify-center gap-2 text-[#1B6B52]">
                    <UploadCloud className="w-5 h-5" />
                    <span className="text-xs font-bold">ފޮޓޯ ނަންގަވާ (ވަގުތުން 16:9 އަށް ކްރޮޕްކުރުމަށް ހުޅުވޭނެ)</span>
                  </div>
                  <p className="text-[11px] text-[#556660] mt-1">
                    ފޮޓޯ އަޕްލޯޑްކުރުމާއެކު 16:9 ރޭޝިއޯއަށް ކްރޮޕްކުރެވޭނެއެވެ • JPG, PNG, WebP
                  </p>
                </div>

                {/* 16:9 Live Preview Box */}
                {editingArticle.featuredImage && (
                  <div className="space-y-2">
                    <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black/10 border border-[#E5ECE8]">
                      <img
                        src={editingArticle.featuredImage}
                        alt="16:9 Standard Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span>16:9 ސްޓޭންޑަޑް</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setArticleCropData({
                            src: editingArticle.featuredImage!,
                            filename: 'article-featured.jpg'
                          })
                        }
                        className="absolute bottom-2.5 left-2.5 bg-white/90 hover:bg-white text-[#1B6B52] text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>އަލުން ކްރޮޕްކުރައްވާ (Re-crop)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ޚުލާޞާ / ތަޢާރަފް (Excerpt / Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => {
                    setFormError(null);
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs leading-relaxed"
                  placeholder="ލިޔުމުގެ ކުރު ޚުލާޞާއެއް ލިޔުއްވާ (ކާޑުތަކުގައި ފެންނާނެ ބައި)..."
                />
              </div>

              {/* WYSIWYG Content Body */}
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1.5 flex items-center justify-between">
                  <span>ލިޔުމުގެ ފުރިހަމަ ބަޔާން (Full Article Body - WYSIWYG Editor) *</span>
                  <span className="text-[11px] font-normal text-[#1B6B52]">RTL ފޯމެޓިންގ، ސުރުޚީ، ލިސްޓް އަދި ޙަދީޘް ބަޔާން</span>
                </label>
                <WysiwygEditor
                  value={editingArticle.content || ''}
                  onChange={(html) => {
                    setFormError(null);
                    setEditingArticle((prev) => (prev ? { ...prev, content: html } : prev));
                  }}
                  onReadingTimeChange={(mins) => {
                    setEditingArticle((prev) => (prev ? { ...prev, readingTimeMinutes: mins } : prev));
                  }}
                  placeholder="މިތަނުގައި ލިޔުމުގެ ފުރިހަމަ ބަޔާން ލިޔުއްވަން ފަށްޓަވާ..."
                  minHeight="340px"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E5ECE8]">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-sm cursor-pointer"
                >
                  ކެންސަލް
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleSave('draft')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#C8E0D5] hover:bg-[#EBF5F0] text-[#1B6B52] font-bold text-xs cursor-pointer"
                  >
                    ޑްރާފްޓެއްގެ ގޮތުގައި ރައްކާކުރައްވާ
                  </button>

                  {isAdmin ? (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleSave('published')}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs"
                    >
                      ސޭވްކޮށް ވަގުތުން ޝާއިޢުކުރައްވާ
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleSave('pending_approval')}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>އެޕްރޫވަލްއަށް ފޮނުއްވާ</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REJECTION MODAL --- */}
      {rejectingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 font-thaana shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5ECE8] pb-3">
              <h3 className="text-base font-bold text-rose-700">މުރާޖަޢާކުރުމަށް އެދިވަޑައިގަންނަވާ</h3>
              <button onClick={() => setRejectingArticle(null)}>
                <X className="w-5 h-5 text-[#556660]" />
              </button>
            </div>

            <p className="text-xs text-[#556660] leading-relaxed">
              ލިޔުން އިޞްލާޙުކުރަންވީ ސަބަބު ނުވަތަ ނަޞޭޙަތް ލިޔުއްވުމުން، ލިޔުންތެރިޔާއަށް އެ މަޢުލޫމާތު ފެންނާނެއެވެ.
            </p>

            <div>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="މިސާލަކަށް: ޙަދީޘްގެ ރިފަރެންސް ޗެކްކޮށްލެއްވުން އެދެން..."
                className="w-full p-3 rounded-xl border border-[#E5ECE8] focus:border-rose-600 outline-none text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingArticle(null)}
                className="px-4 py-2 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-xs"
              >
                ކެންސަލް
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                މުރާޖަޢާއަށް ފޮނުއްވާ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STANDARDIZED 16:9 CROPPER MODAL --- */}
      {articleCropData && (
        <ImageCropperModal
          imageSrc={articleCropData.src}
          filename={articleCropData.filename}
          lockAspect="16:9"
          customTitle="ލިޔުމުގެ ފީޗާރޑް އިމޭޖް (16:9 ސްޓޭންޑަޑް)"
          customSubtitle="ހުރިހާ ލިޔުމެއް އެއް ސައިޒަކަށް ސްޓޭންޑަޑްކުރުމަށްޓަކައި 16:9 އަށް ކްރޮޕްކުރެވޭނެއެވެ."
          onCropComplete={handleCropComplete}
          onClose={() => setArticleCropData(null)}
        />
      )}
    </div>
  );
}
