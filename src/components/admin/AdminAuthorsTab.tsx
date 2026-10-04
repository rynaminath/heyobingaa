import React, { useState } from 'react';
import { UserCheck, Plus, Edit2, Trash2, X, Mail, Shield, AlertCircle } from 'lucide-react';
import { AuthorProfile } from '../../types';

interface AdminAuthorsTabProps {
  authors: AuthorProfile[];
  actionLoading: boolean;
  onSaveAuthor: (author: AuthorProfile) => Promise<void>;
  onDeleteAuthor: (authorId: string) => Promise<void>;
  currentAdminUid: string;
}

export default function AdminAuthorsTab({
  authors,
  actionLoading,
  onSaveAuthor,
  onDeleteAuthor,
  currentAdminUid
}: AdminAuthorsTabProps) {
  const [editingAuthor, setEditingAuthor] = useState<Partial<AuthorProfile> | null>(null);

  const handleOpenAddModal = () => {
    setEditingAuthor({
      id: `author-${Date.now()}`,
      email: '',
      name: '',
      title: 'ދީނީ އަދި އިޖުތިމާޢީ ލިޔުންތެރިޔާ',
      bio: '',
      status: 'active',
      addedAt: new Date().toISOString(),
      addedBy: currentAdminUid
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor?.email || !editingAuthor?.name) {
      alert('ކޮންމެހެން ފުރަންޖެހޭ ބައިތައް (އީމެއިލް އަދި ނަން) ފުރިހަމަކުރައްވާ');
      return;
    }

    const payload: AuthorProfile = {
      id: editingAuthor.id || `author-${Date.now()}`,
      email: editingAuthor.email.trim().toLowerCase(),
      name: editingAuthor.name.trim(),
      title: editingAuthor.title?.trim() || 'ލިޔުންތެރިޔާ',
      bio: editingAuthor.bio?.trim() || '',
      status: editingAuthor.status || 'active',
      addedAt: editingAuthor.addedAt || new Date().toISOString(),
      addedBy: editingAuthor.addedBy || currentAdminUid
    };

    await onSaveAuthor(payload);
    setEditingAuthor(null);
  };

  return (
    <div className="space-y-6 font-thaana">
      {/* Tab Header & Add Author Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E5ECE8] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>ލިޔުންތެރިން ކަނޑައެޅުން (Author Permissions)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2622]">
            ލިޔުންތެރިންގެ ދަފްތަރު ({authors.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#556660] mt-1 max-w-2xl leading-relaxed">
            އެޑްމިނުންގެ އިތުރުން ލިޔުންތައް ލިޔުމަށް ޚާއްޞަ ލިޔުންތެރިން ކަނޑައެޅުން. މި ފަރާތްތަކަށް ހުއްދަ ލިބޭނީ ހަމައެކަނި ލިޔުންތަކުގެ ބަޔަށެވެ.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>އައު ލިޔުންތެރިއަކު ކަނޑައަޅުއްވާ</span>
        </button>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#556660] bg-white rounded-3xl border border-[#E5ECE8]">
            އަދި އެއްވެސް ލިޔުންތެރިއަކު ނެތެވެ. މަތީގައިވާ 'އައު ލިޔުންތެރިއަކު ކަނޑައަޅުއްވާ' ފިއްތަވާލައްވައިގެން ލިޔުންތެރިން އިތުރުކުރައްވާށެވެ.
          </div>
        ) : (
          authors.map((author) => (
            <div
              key={author.id}
              className="bg-white rounded-2xl border border-[#E5ECE8] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center font-bold text-base shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      author.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {author.status === 'active' ? 'ޙަރަކާތްތެރި (Active)' : 'ހުއްޓުވާފައި (Suspended)'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#1C2622]">{author.name}</h3>
                  <p className="text-xs text-[#1B6B52] font-semibold mt-0.5">{author.title}</p>
                </div>

                <div className="bg-[#FAFCFB] p-2.5 rounded-xl border border-[#E5ECE8] space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#556660]">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono text-[11px] truncate dir-ltr text-left">{author.email}</span>
                  </div>
                  {author.bio && (
                    <p className="text-[11px] text-[#556660] line-clamp-2 mt-1 leading-relaxed">
                      {author.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5ECE8]">
                <button
                  type="button"
                  onClick={() => setEditingAuthor(author)}
                  className="p-2 rounded-lg hover:bg-[#EBF5F0] text-[#1B6B52] transition-colors"
                  title="އިސްލާޙުކުރައްވާ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`'${author.name}' ލިޔުންތެރިންގެ ލިސްޓުން ފޮހެލަން ބޭނުންފުޅުތޯ؟`)) {
                      onDeleteAuthor(author.id);
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                  title="ފޮހެލައްވާ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Author Edit/Add Modal */}
      {editingAuthor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto font-thaana">
            <div className="flex items-center justify-between border-b border-[#E5ECE8] pb-3">
              <h3 className="text-lg font-bold text-[#1C2622]">
                {editingAuthor.email ? 'ލިޔުންތެރިޔާގެ މަޢުލޫމާތު އިޞްލާޙުކުރައްވާ' : 'އައު ލިޔުންތެރިއަކު ކަނޑައަޅުއްވާ'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingAuthor(null)}
                className="p-1 hover:bg-[#FAFCFB] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-[#556660]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ލިޔުންތެރިޔާގެ ގޫގުލް އީމެއިލް (Google Email) *
                </label>
                <input
                  type="email"
                  required
                  value={editingAuthor.email || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none font-mono text-xs dir-ltr text-left"
                  placeholder="author@gmail.com"
                />
                <p className="text-[11px] text-[#556660] mt-1">
                  މި އީމެއިލުން ގޫގުލް މެދުވެރިކޮށް ލޮގިންވުމުން ލިޔުންތައް ލިޔުމުގެ ހުއްދަ ލިބޭނެއެވެ.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ލިޔުންތެރިޔާގެ ނަން (Dhivehi Name) *
                </label>
                <input
                  type="text"
                  required
                  value={editingAuthor.name || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                  placeholder="މިސާލަކަށް: އައްޝައިޚް ޢަލީ ނުވަތަ ފާޠިމަތު ނާހިދާ"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ލަޤަބު / ދައުރު (Title / Credentials)
                </label>
                <input
                  type="text"
                  value={editingAuthor.title || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                  placeholder="ދީނީ ލިޔުންތެރިޔާ، މުދައްރިސް..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ސްޓޭޓަސް (Status)</label>
                <select
                  value={editingAuthor.status || 'active'}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none bg-white text-xs font-bold"
                >
                  <option value="active">ޙަރަކާތްތެރި (Active - Can access articles)</option>
                  <option value="suspended">މެދުކަނޑާލާފައި (Suspended)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ތަޢާރަފް (Bio)</label>
                <textarea
                  rows={3}
                  value={editingAuthor.bio || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs"
                  placeholder="ލިޔުންތެރިޔާއާ ބެހޭ ކުރު ތަޢާރަފެއް..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5ECE8]">
                <button
                  type="button"
                  onClick={() => setEditingAuthor(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-sm cursor-pointer"
                >
                  ކެންސަލް
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  ރައްކާކުރައްވާ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
