import { useState, useEffect, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import ReactGA from 'react-ga4';
import { db, storage } from '../config/firebase';
import { MorningNews } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark.css';
import AudioPlayer from '../components/common/AudioPlayer';

// Lazy load NotFoundPage
const NotFoundPage = lazy(() => import('./NotFoundPage'));

// 统一处理 Firestore Timestamp 或字符串日期
const normalizeDate = (value: unknown): string => {
  if (!value) return '';
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  }
  return String(value);
};

function DocumentPage() {
  const { category, id } = useParams<{ category?: string; id: string }>();
  const [document, setDocument] = useState<MorningNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id || !category) {
        setError('Document ID or category missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const docRef = doc(db, category, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setDocument({
            _id: docSnap.id,
            content: data.content || '',
            date: normalizeDate(data.date),
            title: data.title || '',
            sourceFileName: data.sourceFileName || '',
            createdAt: normalizeDate(data.createdAt),
            // Audio fields
            voiceText: typeof data.voiceText === 'string' ? data.voiceText : '',
            ttsStatus: typeof data.ttsStatus === 'string' ? data.ttsStatus : '',
            ttsLanguageCode: typeof data.ttsLanguageCode === 'string' ? data.ttsLanguageCode : undefined,
            ttsVoiceName: typeof data.ttsVoiceName === 'string' ? data.ttsVoiceName : undefined,
            audioStoragePath: typeof data.audioStoragePath === 'string' ? data.audioStoragePath : undefined,
            audioReady: Boolean(data.audioReady),
            ttsErrorMessage: typeof data.ttsErrorMessage === 'string' ? data.ttsErrorMessage : undefined,
          } as MorningNews);
        } else {
          setError('Document does not exist');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [category, id]);

  // Load Audio URL
  useEffect(() => {
    if (!document || !document.audioReady || !document.audioStoragePath) {
      setAudioUrl(null);
      return;
    }

    const loadAudio = async () => {
      try {
        const fileRef = ref(storage, document.audioStoragePath as string);
        const url = await getDownloadURL(fileRef);
        setAudioUrl(url);
      } catch (err) {
        console.error('Failed to load audio', err);
        setAudioUrl(null);
      }
    };

    loadAudio();
  }, [document]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="space-y-4 pt-8">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
           ))}
        </div>
      </div>
    );
  }

  if (error || !document) return <NotFoundPage />;

  return (
    <div className="animate-fade-in relative min-h-screen pb-24">
      <article className="max-w-2xl mx-auto -mt-10 md:mt-0 py-8 md:py-16 px-6 bg-white dark:bg-background-dark md:bg-transparent">
        
        {/* Navigation / Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 font-sans">
          <Link to="/" className="hover:text-primary transition-colors">Dashboard</Link>
          <span>/</span>
          {category && (
            <Link to={`/${category}`} className="hover:text-primary transition-colors capitalize">
              {category}
            </Link>
          )}
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-3 mb-6">
             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               Intelligence Briefing
             </span>
             <span className="text-slate-400 text-sm font-medium">
               {document.date?.split(' ')[0]}
             </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-50 leading-tight mb-6">
            {document.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-serif text-slate-500">
                  N
               </div>
               <span>NewsVoice Intelligence</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
             <span>{Math.ceil(document.content.length / 500)} min read</span>
          </div>
        </header>

        {/* Audio Status */}
        {document.ttsStatus === 'PROCESSING' && (
           <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm flex items-center gap-2">
             <span className="material-symbols-outlined animate-spin text-base">sync</span>
             Generating audio version...
           </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-slate dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-p:font-sans prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ]}
          >
            {document.content}
          </ReactMarkdown>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400 italic font-serif text-center">
            End of Briefing
          </p>
        </div>
      </article>

      {/* Sticky Audio Player */}
      {audioUrl && (
        <AudioPlayer 
          src={audioUrl} 
          title={document.title}
          onPlay={() => {
             ReactGA.event({
               category: 'Audio',
               action: 'Play',
               label: document?.title || 'Unknown Audio',
             });
          }}
        />
      )}
    </div>
  );
}

export default DocumentPage;
