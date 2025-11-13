import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Loader, Play, FileText } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
}

interface SearchResults {
  videos: Video[];
  articles: Article[];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/search/${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Search Learning Resources</h1>
        <p className="text-muted-foreground">
          Find YouTube videos and articles on any topic
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything... (e.g., React Hooks, Machine Learning)"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 px-4 py-1 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg max-w-2xl mx-auto mb-8">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-16">
          {results.videos.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Play className="w-6 h-6 text-red-600" />
                YouTube Videos
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors"
                  >
                    <div className="relative overflow-hidden bg-black aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {results.articles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Articles & Blog Posts
              </h2>
              <div className="space-y-4">
                {results.articles.map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors flex-1 line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-3">
                      {article.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {article.source}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {results.videos.length === 0 && results.articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No results found. Try a different search term.
              </p>
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-muted-foreground opacity-50 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Start searching to discover learning resources
          </p>
        </div>
      )}
    </div>
  );
}
