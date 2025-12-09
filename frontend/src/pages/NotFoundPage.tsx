import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page
 * 友好的 404 错误页面，提供导航选项帮助用户返回
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 404 大标题 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
            404
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500">
              search_off
            </span>
          </div>
        </div>

        {/* 错误信息 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            页面未找到
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
            抱歉，您访问的页面不存在或已被移除
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            请检查 URL 是否正确，或使用下方导航返回
          </p>
        </div>

        {/* 导航按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <span className="material-symbols-outlined">home</span>
            <span>返回主页</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>返回上一页</span>
          </button>
        </div>

        {/* 快速导航链接 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">
            快速导航
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/business"
              className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-800 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                business_center
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-50">
                商业资讯
              </span>
            </Link>

            <Link
              to="/technology"
              className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 border border-purple-200 dark:border-purple-800 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-4xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                computer
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-50">
                科技前沿
              </span>
            </Link>

            <Link
              to="/sports"
              className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 border border-green-200 dark:border-green-800 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                sports_soccer
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-50">
                体育赛事
              </span>
            </Link>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-sm text-slate-500 dark:text-slate-500">
          <p>如果您认为这是一个错误，请联系管理员</p>
        </div>
      </div>
    </div>
  );
}

