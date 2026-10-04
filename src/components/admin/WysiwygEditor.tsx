import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
  Eye,
  Code,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  onReadingTimeChange?: (minutes: number) => void;
}

export default function WysiwygEditor({
  value,
  onChange,
  placeholder = 'މިތަނުގައި ލިޔުމުގެ ފުރިހަމަ ބަޔާން ލިޔުއްވަން ފަށްޓަވާ...',
  minHeight = '320px',
  onReadingTimeChange
}: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [htmlContent, setHtmlContent] = useState(value || '');

  // Modals for Link and Image insertion
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const savedSelectionRef = useRef<Range | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  // Active format state
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    h2: false,
    h3: false,
    blockquote: false,
    ul: false,
    ol: false,
    alignRight: true,
    alignCenter: false,
    alignLeft: false
  });

  // Calculate word and character count
  const getStats = useCallback((html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    const chars = cleanText.length;
    // Dhivehi average reading speed ~ 130 words per min
    const estimatedMinutes = Math.max(1, Math.ceil(words / 130));
    return { words, chars, estimatedMinutes };
  }, []);

  const stats = getStats(htmlContent);

  // Sync reading time change to parent if callback provided
  useEffect(() => {
    if (onReadingTimeChange && stats.estimatedMinutes) {
      onReadingTimeChange(stats.estimatedMinutes);
    }
  }, [stats.estimatedMinutes, onReadingTimeChange]);

  // Keep internal html state in sync with prop value when updated externally
  useEffect(() => {
    if (value !== htmlContent) {
      setHtmlContent(value || '');
      if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Initialize content on mount
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Update active formats based on current selection
  const updateActiveFormats = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      setFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        h2: document.queryCommandValue('formatBlock') === 'h2',
        h3: document.queryCommandValue('formatBlock') === 'h3',
        blockquote: document.queryCommandValue('formatBlock') === 'blockquote',
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
        alignRight: document.queryCommandState('justifyRight'),
        alignCenter: document.queryCommandState('justifyCenter'),
        alignLeft: document.queryCommandState('justifyLeft')
      });
    } catch {
      // Ignore queryCommand errors if element not focused
    }
  }, []);

  // Execute standard execCommand
  const execCmd = (cmd: string, val: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    handleEditorInput();
    updateActiveFormats();
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const newHtml = editorRef.current.innerHTML;
    setHtmlContent(newHtml);
    onChange(newHtml);
  };

  const formatBlock = (tag: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const currentTag = document.queryCommandValue('formatBlock');
    if (currentTag === tag) {
      document.execCommand('formatBlock', false, '<p>');
    } else {
      document.execCommand('formatBlock', false, `<${tag}>`);
    }
    handleEditorInput();
    updateActiveFormats();
  };

  // Save current selection for modals
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
      const txt = sel.toString();
      if (txt) setLinkText(txt);
    } else {
      savedSelectionRef.current = null;
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current && window.getSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  // Link Insertion
  const handleOpenLinkModal = () => {
    saveCurrentSelection();
    setShowLinkModal(true);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }

    let validUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(validUrl) && !validUrl.startsWith('#') && !validUrl.startsWith('/')) {
      validUrl = `https://${validUrl}`;
    }

    if (linkText.trim() && savedSelectionRef.current?.collapsed) {
      const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" class="text-[#1B6B52] underline font-semibold hover:text-[#15533F]">${linkText.trim()}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      document.execCommand('createLink', false, validUrl);
      // Ensure inserted links have styling
      const links = editorRef.current?.getElementsByTagName('a');
      if (links) {
        for (let i = 0; i < links.length; i++) {
          const l = links[i];
          if (l.getAttribute('href') === validUrl) {
            l.setAttribute('target', '_blank');
            l.setAttribute('rel', 'noopener noreferrer');
            l.classList.add('text-[#1B6B52]', 'underline', 'font-semibold');
          }
        }
      }
    }

    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
    handleEditorInput();
  };

  // Image Insertion
  const handleOpenImageModal = () => {
    saveCurrentSelection();
    setShowImageModal(true);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const captionHtml = imageCaption.trim()
      ? `<figcaption class="text-xs text-center text-[#556660] font-thaana mt-1.5">${imageCaption.trim()}</figcaption>`
      : '';
    const imgHtml = `
      <figure class="my-4 max-w-full">
        <img src="${imageUrl.trim()}" alt="${imageCaption.trim() || 'ލިޔުމުގެ ތަޞްވީރު'}" class="w-full rounded-2xl border border-[#E5ECE8] shadow-sm max-h-[480px] object-cover mx-auto" />
        ${captionHtml}
      </figure>
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, imgHtml);
    setShowImageModal(false);
    setImageUrl('');
    setImageCaption('');
    handleEditorInput();
  };

  // Insert Horizontal Rule
  const handleInsertDivider = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('insertHTML', false, '<hr class="my-6 border-t-2 border-[#E5ECE8]" /><p><br></p>');
    handleEditorInput();
  };

  // Insert Styled Hadith / Quote Box
  const handleInsertHadithQuote = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const quoteHtml = `
      <blockquote class="my-4 p-5 rounded-2xl bg-[#EBF5F0]/80 border-r-4 border-[#1B6B52] text-[#1C2622] font-semibold text-base leading-loose shadow-xs font-thaana text-right">
        «މިތަނުގައި ޙަދީޘް ނުވަތަ ޚާއްޞަ ޢިބާރާތް ލިޔުއްވާ»
      </blockquote>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, quoteHtml);
    handleEditorInput();
  };

  return (
    <div className="w-full border border-[#D5E2DC] rounded-2xl bg-white shadow-xs overflow-hidden flex flex-col font-thaana">
      {/* Top Header: Modes & Word Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#F6FAF8] border-b border-[#E5ECE8]">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5ECE8] shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-[#1B6B52] text-white shadow-2xs'
                : 'text-[#556660] hover:text-[#1C2622]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ލިޔުއްވާ (Visual Editor)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#1B6B52] text-white shadow-2xs'
                : 'text-[#556660] hover:text-[#1C2622]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>ކޯޑު (HTML View)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#1B6B52] text-white shadow-2xs'
                : 'text-[#556660] hover:text-[#1C2622]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ޕްރިވިއު (Preview)</span>
          </button>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs text-[#556660] font-thaana mr-auto sm:mr-0">
          <span className="bg-[#EBF5F0] text-[#1B6B52] px-2.5 py-1 rounded-lg font-bold">
            {stats.words} ލަފްޒު
          </span>
          <span className="text-[#556660]">
            {stats.chars} އަކުރު
          </span>
          <span className="hidden sm:inline-block text-[#556660] border-r border-[#D5E2DC] pr-2 mr-2">
            ގާތްގަނޑަކަށް {stats.estimatedMinutes} މިނެޓުގެ ކިޔުމެއް
          </span>
        </div>
      </div>

      {/* Toolbar - Only visible in Visual Mode */}
      {activeTab === 'visual' && (
        <div className="p-2 bg-white border-b border-[#E5ECE8] flex flex-wrap items-center gap-1.5 select-none" dir="rtl">
          {/* Headings */}
          <div className="flex items-center gap-0.5 border-l border-[#E5ECE8] pl-1.5 ml-1">
            <button
              type="button"
              onClick={() => formatBlock('h2')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                formats.h2 ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="މައި ސުރުޚީ (Heading 2)"
            >
              <Heading2 className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">ސުރުޚީ</span>
            </button>

            <button
              type="button"
              onClick={() => formatBlock('h3')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                formats.h3 ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="ކުޑަ ސުރުޚީ (Heading 3)"
            >
              <Heading3 className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">ކުޑަ ސުރުޚީ</span>
            </button>
          </div>

          {/* Text Styling: Bold, Italic, Underline, Strike */}
          <div className="flex items-center gap-0.5 border-l border-[#E5ECE8] pl-1.5 ml-1">
            <button
              type="button"
              onClick={() => execCmd('bold')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.bold ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="ފަލަކޮށް (Bold - Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('italic')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.italic ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="އަރިއަރިކޮށް (Italic - Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('underline')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.underline ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="ދަށުރޮނގު (Underline - Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('strikeThrough')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.strikeThrough ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="މެދު ރޮނގު (Strikethrough)"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 border-l border-[#E5ECE8] pl-1.5 ml-1">
            <button
              type="button"
              onClick={() => execCmd('justifyRight')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.alignRight ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="ކަނާތްފަރާތަށް (Align Right - Standard RTL)"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('justifyCenter')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.alignCenter ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="މެދަށް (Align Center)"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('justifyLeft')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.alignLeft ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="ވާތްފަރާތަށް (Align Left)"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5 border-l border-[#E5ECE8] pl-1.5 ml-1">
            <button
              type="button"
              onClick={() => execCmd('insertUnorderedList')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.ul ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="ނުކުތާ ލިސްޓް (Bullet List)"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('insertOrderedList')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                formats.ol ? 'bg-[#1B6B52] text-white' : 'hover:bg-[#EBF5F0] text-[#1C2622]'
              }`}
              title="ނަންބަރު ލިސްޓް (Numbered List)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleInsertHadithQuote}
              className="p-1.5 rounded-lg hover:bg-[#EBF5F0] text-[#1B6B52] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="ޙަދީޘް / އާޔަތް / ޚާއްޞަ ބަޔާން (Hadith/Quote Box)"
            >
              <Quote className="w-4 h-4" />
              <span className="text-[11px] hidden md:inline">ޙަދީޘް/ބަޔާން</span>
            </button>
          </div>

          {/* Insert Items: Link, Image, Divider */}
          <div className="flex items-center gap-0.5 border-l border-[#E5ECE8] pl-1.5 ml-1">
            <button
              type="button"
              onClick={handleOpenLinkModal}
              className="p-1.5 rounded-lg hover:bg-[#EBF5F0] text-[#1C2622] transition-colors cursor-pointer"
              title="ލިންކް އެޅުވުން (Insert Link)"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOpenImageModal}
              className="p-1.5 rounded-lg hover:bg-[#EBF5F0] text-[#1C2622] transition-colors cursor-pointer"
              title="ތަޞްވީރު ހިމެނުން (Insert Image)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleInsertDivider}
              className="p-1.5 rounded-lg hover:bg-[#EBF5F0] text-[#1C2622] transition-colors cursor-pointer"
              title="ވަކިކުރާ ރޮނގު (Horizontal Divider)"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Clear & History */}
          <div className="flex items-center gap-0.5 mr-auto">
            <button
              type="button"
              onClick={() => execCmd('undo')}
              className="p-1.5 rounded-lg hover:bg-[#EBF5F0] text-[#556660] hover:text-[#1C2622] transition-colors cursor-pointer"
              title="އަނބުރާ ގެނައުން (Undo - Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('redo')}
              className="p-1.5 rounded-lg hover:bg-[#EBF5F0] text-[#556660] hover:text-[#1C2622] transition-colors cursor-pointer"
              title="ކުރިން ހުރިގޮތަށް (Redo - Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => execCmd('removeFormat')}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
              title="ފޯމެޓިންގ ފޮހެލުން (Clear Formatting)"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="relative flex-1 bg-white">
        {/* Visual Mode (contentEditable) */}
        {activeTab === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            dir="rtl"
            role="textbox"
            aria-multiline="true"
            onInput={handleEditorInput}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            className="p-4 sm:p-6 outline-none font-thaana text-right text-base leading-[1.25] text-[#1C2622] focus:ring-0 overflow-y-auto [&_*]:leading-[1.25] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1B6B52] [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1C2622] [&_h3]:my-2 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:my-2 [&_li]:my-1 [&_blockquote]:border-r-4 [&_blockquote]:border-[#1B6B52] [&_blockquote]:bg-[#EBF5F0]/70 [&_blockquote]:p-4 [&_blockquote]:rounded-2xl [&_blockquote]:font-semibold [&_blockquote]:my-3 [&_a]:text-[#1B6B52] [&_a]:underline"
            style={{ minHeight }}
            data-placeholder={placeholder}
          />
        )}

        {/* Code / HTML Mode */}
        {activeTab === 'code' && (
          <div className="p-3 bg-[#0A1612] text-emerald-400 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-900/60 text-white/70">
              <span dir="ltr">&lt;HTML Source Editor&gt;</span>
              <span className="font-thaana text-[11px] text-emerald-300">ކޯޑު ބަދަލުކުރެއްވުމަށްފަހު ވިޝުއަލް ޓެބަށް ބަދަލުވެލައްވާ</span>
            </div>
            <textarea
              dir="ltr"
              value={htmlContent}
              onChange={(e) => {
                setHtmlContent(e.target.value);
                onChange(e.target.value);
              }}
              className="w-full bg-transparent text-emerald-300 font-mono text-xs leading-relaxed outline-none resize-y"
              style={{ minHeight }}
              placeholder="<p>ލިޔުމުގެ HTML ކޯޑު މިތަނުގައި ލިޔުއްވާ...</p>"
            />
          </div>
        )}

        {/* Live Article Preview Mode */}
        {activeTab === 'preview' && (
          <div className="p-6 sm:p-8 bg-[#FAFCFB] overflow-y-auto" style={{ minHeight }} dir="rtl">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="pb-3 border-b border-[#E5ECE8] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B6B52] bg-[#EBF5F0] px-3 py-1 rounded-full">
                  ލައިވް ޕްރިވިއު (މި ލިޔުން ވެބްސައިޓުގައި ފެންނާނެ ގޮތް)
                </span>
                <span className="text-xs text-[#556660]">
                  {stats.words} ލަފްޒު • {stats.estimatedMinutes} މިނެޓުގެ ކިޔުމެއް
                </span>
              </div>

              {htmlContent ? (
                <div
                  className="w-full text-[#2A3B34] font-thaana space-y-4 text-base sm:text-lg leading-[1.25] text-right [&_*]:leading-[1.25] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1C2622] [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1C2622] [&_h3]:mt-3 [&_h3]:mb-1.5 [&_p]:my-2 [&_blockquote]:border-r-4 [&_blockquote]:border-[#1B6B52] [&_blockquote]:bg-[#EBF5F0]/70 [&_blockquote]:p-5 [&_blockquote]:rounded-2xl [&_blockquote]:font-semibold [&_blockquote]:my-3.5 [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:my-2 [&_a]:text-[#1B6B52] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <div className="text-center py-12 text-[#556660]">
                  <p className="font-bold">އަދި އެއްވެސް ލިޔުމެއް ނެތް</p>
                  <p className="text-xs mt-1">ވިޝުއަލް އެޑިޓަރަށް އެނބުރި ވަޑައިގެން ލިޔުއްވަން ފަށްޓަވާށެވެ.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Insert Link */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E5ECE8] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE8]">
              <h3 className="font-bold text-base text-[#1C2622] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#1B6B52]" />
                <span>ލިންކް އެޅުވުން (Insert Link)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F2F7F4] flex items-center justify-center text-[#556660]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ލިންކުގެ ޔޫ.އާރް.އެލް (URL) *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ފެންނާނެ ލިޔުން (Link Display Text)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="މިސާލަކަށް: އިތުރު ތަފްޞީލް ވިދާޅުވުމަށް"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-xs hover:bg-[#FAFCFB]"
                >
                  ކެންސަލް
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-xs shadow-xs"
                >
                  ލިންކް ހިމަނުއްވާ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Insert Image */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E5ECE8] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE8]">
              <h3 className="font-bold text-base text-[#1C2622] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#1B6B52]" />
                <span>ލިޔުމުގެ ތެރެއަށް ތަޞްވީރު ހިމެނުން</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F2F7F4] flex items-center justify-center text-[#556660]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ތަޞްވީރުގެ ލިންކް / Image URL *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">
                  ކެޕްޝަން ނުވަތަ ތަފްޞީލް (Caption / Alt Text)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="މިސާލަކަށް: މާލޭގައި ބޭއްވުނު ޚާއްޞަ ދަރުސް"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none text-xs"
                />
              </div>

              {/* Live Preview of image if URL is entered */}
              {imageUrl && (
                <div className="aspect-16/9 rounded-xl overflow-hidden border border-[#E5ECE8] bg-[#F6FAF8]">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-xs hover:bg-[#FAFCFB]"
                >
                  ކެންސަލް
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-xs shadow-xs"
                >
                  ތަޞްވީރު ހިމަނުއްވާ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
