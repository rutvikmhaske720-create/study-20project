import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, Plus, Loader } from "lucide-react";

interface Group {
  id: number;
  title: string;
  description: string;
  topic_id: number;
  created_by: number;
  members: Array<{ id: number; name: string }>;
}

interface Topic {
  id: number;
  name: string;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic_id: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch groups");
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [navigate]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          topic_id: parseInt(formData.topic_id),
        }),
      });

      if (!response.ok) throw new Error("Failed to create group");

      const newGroup = await response.json();
      setGroups([...groups, newGroup]);
      setFormData({ title: "", description: "", topic_id: "" });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/${groupId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to join group");

      const updatedGroup = await response.json();
      setGroups(groups.map((g) => (g.id === groupId ? updatedGroup : g)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join group");
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
          <h1 className="text-4xl font-bold mb-2">Study Groups</h1>
          <p className="text-muted-foreground">
            Connect with other learners and share knowledge
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Create Group
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-card rounded-lg border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Create a New Group</h2>
          <form onSubmit={handleCreateGroup} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">Group Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., React Learning Group"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your group..."
                className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="number"
                value={formData.topic_id}
                onChange={(e) =>
                  setFormData({ ...formData, topic_id: e.target.value })
                }
                placeholder="Topic ID"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
              >
                Create Group
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground opacity-50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No groups yet. Create one to get started!
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors cursor-pointer"
            >
              <h3 className="font-semibold text-lg mb-2">{group.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {group.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{group.members.length} members</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleJoinGroup(group.id);
                  }}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Join
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
