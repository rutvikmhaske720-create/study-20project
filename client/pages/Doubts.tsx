import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Plus, Loader, MessageSquare } from "lucide-react";

interface Doubt {
  id: number;
  topic: string;
  title: string;
  description: string;
  created_by: number;
  created_at: string;
  created_by_user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function Doubts() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterTopic, setFilterTopic] = useState("");
  const [formData, setFormData] = useState({
    topic: "",
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDoubts = async () => {
      try {
        const url = filterTopic
          ? `http://localhost:8000/api/doubts?topic=${filterTopic}`
          : "http://localhost:8000/api/doubts";

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch doubts");
        const data = await response.json();
        setDoubts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load doubts");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchDoubts();
  }, [navigate, filterTopic]);

  const handleCreateDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/api/doubts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create doubt");

      const newDoubt = await response.json();
      setDoubts([newDoubt, ...doubts]);
      setFormData({ topic: "", title: "", description: "" });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create doubt");
    }
  };

  const handleDeleteDoubt = async (doubtId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/doubts/${doubtId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete doubt");
      setDoubts(doubts.filter((d) => d.id !== doubtId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete doubt");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Doubts & Questions</h1>
          <p className="text-muted-foreground">
            Ask questions and help others learn together
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Post Question
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-card rounded-lg border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Post Your Question</h2>
          <form onSubmit={handleCreateDoubt} className="space-y-4 max-w-3xl">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  placeholder="e.g., React, Python, Machine Learning"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="What's your question?"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Provide details about your question..."
                className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={6}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
              >
                Post Question
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 rounded-lg border border-border hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          placeholder="Filter by topic..."
          className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-4">
        {doubts.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-muted-foreground opacity-50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No questions yet. Be the first to ask!
            </p>
          </div>
        ) : (
          doubts.map((doubt) => (
            <div
              key={doubt.id}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {doubt.topic}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{doubt.title}</h3>
                </div>
                <button
                  onClick={() => handleDeleteDoubt(doubt.id)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>

              <p className="text-muted-foreground mb-4">{doubt.description}</p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">
                    {doubt.created_by_user.name}
                  </p>
                  <p className="text-xs">
                    {new Date(doubt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>0 answers</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
