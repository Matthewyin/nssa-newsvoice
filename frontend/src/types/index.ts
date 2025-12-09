export interface ProcessedArticle {
  id: string;
  title: string;
  url: string;
  summary: string;
  content: string;
  publishTime: Date;
  crawledAt: Date;
  sourceName: string;
  sourceCategory: string;
  importanceScore: number;
  metadata: StructuredMetadata;
}

export interface StructuredMetadata {
  companies: string[];
  people: string[];
  tags: string[];
  eventType: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  regions: string[];
  industries: string[];
  financial?: {
    fundingAmount?: string;
    fundingRound?: string;
    stockSymbol?: string;
    valuation?: string;
  };
  relatedArticleIds: string[];
}

export interface BriefingStatistics {
  totalCount: number;
  sourceBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  topCompanies: string[];
  topTags: string[];
}

export interface ProcessedBriefing {
  id: string;
  date: string;
  generatedAt: Date;
  audioUrl: string;
  script?: string; // Audio script text
  statistics: BriefingStatistics;
  status: 'generating' | 'completed' | 'failed';
  error?: string;
}

export interface BriefingWithArticles extends ProcessedBriefing {
  articles: ProcessedArticle[];
}

// Configuration types
export interface HotRankingConfig {
  enabled: boolean;
  maxCount: number;
  minScore: number;
  weights: {
    viewCount: number;
    commentCount: number;
    recency: number;
  };
  sortBy: 'hot' | 'time' | 'mixed';
}

export interface KeywordFilterConfig {
  enabled: boolean;
  mode: 'none' | 'include' | 'exclude';
  includeKeywords: string[];
  excludeKeywords: string[];
  applyTo: {
    title: boolean;
    summary: boolean;
    content: boolean;
  };
}

export interface NewsSourceConfig {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  type: 'rss' | 'api' | 'scrape';
  feedUrl?: string;
  apiKey?: string;
  scrapeConfig?: {
    baseUrl: string;
    listPageUrl: string;
    selectors: {
      articleList: string;
      title: string;
      link: string;
      publishTime: string;
      content: string;
    };
  };
  hotRanking?: HotRankingConfig;
  keywordFilter?: KeywordFilterConfig;
  headers?: Record<string, string>;
  enabled: boolean;
  lastCrawlTime?: Date;
  lastCrawlStatus?: 'success' | 'failed';
  lastCrawlCount?: number;
}

export interface AIModelConfig {
  provider: 'openai' | 'googleai';
  modelName: string;
  apiKey: string;
  apiEndpoint?: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  timeout: number;
}

export interface AudioConfig {
  voiceName: string;
  speakingRate: number;
  pitch?: number; // -50 to 50, default 0
  volume?: number; // 0 to 100, default 100
  audioFormat: string;
  bitrate: number;
}

export interface SystemConfig {
  scheduledTime: string;
  timezone: string;
  maxArticlesPerDay: number;
}

// Morning News Document (from n8n workflow)
export interface MorningNews {
  _id: string;
  content: string;
  date: string;
  title: string;
  sourceFileName: string;
  createdAt: string;
  // 语音相关字段（可选）
  voiceText?: string;
  ttsStatus?: string;
  ttsLanguageCode?: string;
  ttsVoiceName?: string;
  audioStoragePath?: string;
  audioReady?: boolean;
  ttsErrorMessage?: string;
}
