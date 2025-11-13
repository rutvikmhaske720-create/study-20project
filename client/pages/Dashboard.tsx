import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, TrendingUp, Loader } from "lucide-react";

interface DashboardData {
  recent_searches: Array<{ topic: string; searched_at: string }>;
  joined_groups: Array<{
    id: number;
    title: string;
    description: string;
    topic_id: number;
  }>;
  recommended_topics: Array<{ id: number; name: string; description: string }>;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your learning summary.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Recent Searches
              </p>
              <p className="text-3xl font-bold">
                {dashboardData?.recent_searches.length || 0}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Joined Groups
              </p>
              <p className="text-3xl font-bold">
                {dashboardData?.joined_groups.length || 0}
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-600 dark:text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Topics Available
              </p>
              <p className="text-3xl font-bold">
                {dashboardData?.recommended_topics.length || 0}
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-green-600 dark:text-green-400 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Searches</h2>
          {dashboardData?.recent_searches.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No searches yet. Start exploring!
            </p>
          ) : (
            <div className="space-y-3">
              {dashboardData?.recent_searches.map((search, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-lg border border-border p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{search.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(search.searched_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Your Groups</h2>
          {dashboardData?.joined_groups.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No groups yet. Join or create one!
            </p>
          ) : (
            <div className="space-y-3">
              {dashboardData?.joined_groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-card rounded-lg border border-border p-4"
                >
                  <p className="font-semibold">{group.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommended Topics</h2>
        {dashboardData?.recommended_topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No recommendations available.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData?.recommended_topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="font-semibold mb-2">{topic.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {topic.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
