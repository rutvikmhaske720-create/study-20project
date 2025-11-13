import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Share2, Loader, LogOut } from "lucide-react";

interface GroupMember {
  id: number;
  name: string;
  email: string;
}

interface GroupResource {
  id: number;
  title: string;
  url: string;
  resource_type: string;
  shared_by: number;
}

interface GroupData {
  id: number;
  title: string;
  description: string;
  topic_id: number;
  created_by: number;
  members: GroupMember[];
  resources: GroupResource[];
}

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareData, setShareData] = useState({
    title: "",
    url: "",
    resource_type: "article",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchGroup = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/groups/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch group");
        const data = await response.json();
        setGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load group");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, navigate]);

  const handleShareResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/${id}/resources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shareData),
        }
      );

      if (!response.ok) throw new Error("Failed to share resource");

      setShareData({ title: "", url: "", resource_type: "article" });
      setShowShareForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share resource");
    }
  };

  const handleLeaveGroup = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/${id}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to leave group");
      navigate("/groups");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave group");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg">
          {error || "Group not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{group.title}</h1>
        <p className="text-muted-foreground">{group.description}</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                Shared Resources
              </h2>
              <button
                onClick={() => setShowShareForm(!showShareForm)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
              >
                Share Resource
              </button>
            </div>

            {showShareForm && (
              <form
                onSubmit={handleShareResource}
                className="bg-card rounded-lg border border-border p-6 mb-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    value={shareData.title}
                    onChange={(e) =>
                      setShareData({ ...shareData, title: e.target.value })
                    }
                    placeholder="e.g., Awesome React Tutorial"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    value={shareData.url}
                    onChange={(e) =>
                      setShareData({ ...shareData, url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={shareData.resource_type}
                    onChange={(e) =>
                      setShareData({
                        ...shareData,
                        resource_type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="article">Article</option>
                    <option value="youtube">YouTube Video</option>
                    <option value="course">Course</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShareForm(false)}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {group.resources.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No resources shared yet
                </p>
              ) : (
                group.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-card rounded-lg border border-border p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Type: {resource.resource_type}
                        </p>
                      </div>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {resource.resource_type}
                      </span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Members ({group.members.length})
            </h2>
            <div className="space-y-3 mb-6">
              {group.members.map((member) => (
                <div key={member.id} className="py-2 border-b border-border last:border-0">
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleLeaveGroup}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Leave Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
