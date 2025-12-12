import { useState, useEffect, lazy, useCallback } from 'react';
import { Link, useParams, NavLink } from 'react-router-dom';
import { collection, getDocs, query, orderBy, Timestamp, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MorningNews } from '../types';
import EmptyState from '../components/EmptyState';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';

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

const categoryInfo: Record<string, { name: string; icon: string; description: string }> = {
  business: { name: 'Business', icon: '💼', description: 'Market & Economy' },
  technology: { name: 'Technology', icon: '💻', description: 'Tech & Innovation' },
  sports: { name: 'Sports', icon: '⚽', description: 'Match & Athletes' },
  security: { name: 'Security', icon: '🛡️', description: 'Cybersecurity' },
};

const PAGE_SIZE = 15;

function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [documents, setDocuments] = useState<MorningNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const currentCategory = category
    ? categoryInfo[category] || { 
        name: category.charAt(0).toUpperCase() + category.slice(1), 
        icon: '📄', 
        description: 'Documents' 
      }
    : null;

  const docToNews = useCallback((doc: QueryDocumentSnapshot): MorningNews => {
    const data = doc.data();
    return {
      _id: doc.id,
      content: data.content || '',
      date: normalizeDate(data.date),
      title: data.title || '',
      sourceFileName: data.sourceFileName || '',
      createdAt: normalizeDate(data.createdAt),
      // Add read time estimate mock if not present
    };
  }, []);

  const processSnapshot = useCallback((snapshot: any) => {
    if (snapshot.empty) {
      // If it's the initial load (documents empty) or loadmore, handle accordingly
      // But here we just update state based on snapshot
      if (snapshot.size === 0) { // Using size instead of empty for certainty
         // If documents is empty and this is empty, then no docs.
         // But we can't easily check 'documents' state here without adding it to deps, causing loop.
         // We rely on 'setHasMore'
         setHasMore(false);
      }
      return;
    }

    const newDocs = snapshot.docs.map(docToNews);
    
    // Determine if we append or replace. 
    // Actually, processSnapshot is called by both initial and loadMore.
    // For initial, we cleared docs before calling fetchInitial.
    // For loadMore, we append.
    // But this function just appends? No, we need to pass a flag or handle inside the caller.
    
    // Let's refactor: processSnapshot should return data, and useEffect/loadMore handles state.
    return { 
        newDocs, 
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        isFullPage: snapshot.docs.length >= PAGE_SIZE 
    };
  }, [docToNews]);

  // Initial Fetch
  useEffect(() => {
    const fetchInitial = async () => {
      if (!category) return;
      
      setLoading(true);
      setDocuments([]);
      setHasMore(true);
      setLastVisible(null);
      setNotFound(false);
      
      try {
        let snapshot;
        // Prioritize sorting by date (news time)
        let q = query(
          collection(db, category),
          orderBy('date', 'desc'),
          limit(PAGE_SIZE)
        );

        try {
           snapshot = await getDocs(q);
        } catch (e) {
           console.warn('date sort failed, using createdAt', e);
           // Fallback to createdAt
           q = query(
            collection(db, category),
            orderBy('createdAt', 'desc'),
            limit(PAGE_SIZE)
           );
           snapshot = await getDocs(q);
        }

        if (snapshot.empty) {
            setHasMore(false);
            setDocuments([]); // Explicitly set empty
        } else {
            const result = processSnapshot(snapshot);
            if (result) {
                setDocuments(result.newDocs);
                setLastVisible(result.lastDoc);
                setHasMore(result.isFullPage);
            }
        }

      } catch (err: any) {
        console.error('Error fetching docs:', err);
        // Only trigger not found if it's strictly not a permission error or potentially transient error
        // If permission denied (e.g. not logged in), show empty state or handle differently, but here we prevent 404
        if (err.code === 'permission-denied') {
             // Handle permission denied: potentially empty list or redirect
             setDocuments([]); 
             setHasMore(false);
             // Optionally set error state to show "Permission Denied" message instead of 404
        } else {
             // For other errors, we might still want to show content if possible, or error state
             // But defaulting to NotFound (404) is too aggressive for data fetch errors
             // setNotFound(true); // REMOVED: Do not redirect to 404 on fetch error
             setDocuments([]);
             setHasMore(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [category, processSnapshot]);

  const loadMore = async () => {
    if (!category || !lastVisible || loadingMore) return;
    
    setLoadingMore(true);
    try {
      let snapshot;
      // Prioritize sorting by date (news time)
      const q = query(
        collection(db, category),
        orderBy('date', 'desc'),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
      
      try {
        snapshot = await getDocs(q);
      } catch (e) {
         console.warn('date sort failed for loadMore, using createdAt', e);
         const qCreated = query(
           collection(db, category),
           orderBy('createdAt', 'desc'),
           startAfter(lastVisible),
           limit(PAGE_SIZE)
         );
         snapshot = await getDocs(qCreated);
      }

      if (!snapshot.empty) {
        const result = processSnapshot(snapshot);
         if (result) {
             setDocuments(prev => [...prev, ...result.newDocs]);
             setLastVisible(result.lastDoc);
             if (!result.isFullPage) setHasMore(false);
         }
      } else {
          setHasMore(false);
      }
      
    } catch (err) {
      console.error('Load more failed', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (notFound || !currentCategory) return <NotFoundPage />;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen gap-8 py-8 animate-fade-in">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Tabs */}
      <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 flex gap-2 scrollbar-hide">
        {['business', 'technology', 'sports', 'security'].map(cat => (
           <NavLink
             key={cat}
             to={`/${cat}`}
             className={({ isActive }) =>
               `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                 isActive
                   ? 'bg-primary text-white border-primary'
                   : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
               }`
             }
           >
             {cat.charAt(0).toUpperCase() + cat.slice(1)}
           </NavLink>
        ))}
      </div>

      <main className="flex-1 min-w-0">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2 text-primary font-medium">
             <span className="text-3xl">{currentCategory.icon}</span>
             <span className="text-sm font-bold uppercase tracking-widest">{currentCategory.name} Feed</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-50 mb-4">
            Latest in {currentCategory.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-sans max-w-2xl leading-relaxed">
            {currentCategory.description}. Curated for professionals.
          </p>
        </header>

        {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
               ))}
             </div>
        ) : documents.length === 0 ? (
          <EmptyState title="No updates yet" description="Check back later for new briefings." />
        ) : (
          <div className="space-y-6">
            {documents.map((doc) => (
              <Link
                key={doc._id}
                to={`/${category}/${doc._id}`}
                className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 flex md:flex-col items-center justify-center gap-2 md:gap-0 md:w-20 md:border-r md:border-slate-100 md:dark:border-slate-800 pr-6">
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                     {doc.date?.split(' ')[0] || 'DATE'}
                   </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {doc.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {doc.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      {Math.max(1, Math.ceil(doc.content.length / 500))} min read
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Article <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {hasMore && (
              <div className="mt-10 text-center">
                <Button 
                  onClick={loadMore} 
                  loading={loadingMore}
                  variant="secondary"
                  size="lg"
                  className="min-w-[200px]"
                >
                  Load More Briefings
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoryPage;
