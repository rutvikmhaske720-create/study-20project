import { Link } from "react-router-dom";
import { BookOpen, Users, Search, Brain } from "lucide-react";

export default function Index() {
  return (
    <div className="w-full">
      <section className="relative w-full overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learn Together, Grow Together
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              LearnConnect is a modern learning platform that helps you discover
              educational resources and connect with fellow learners around the
              world.
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link
                to="/signup"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-200 text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-secondary transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Discover Resources</h3>
              <p className="text-sm text-muted-foreground">
                Find YouTube videos and articles on any topic you want to learn
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-purple-100 dark:bg-purple-900 mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Join Communities</h3>
              <p className="text-sm text-muted-foreground">
                Connect with other learners in topic-based study groups
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-green-100 dark:bg-green-900 mb-4">
                <Brain className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Clear Doubts</h3>
              <p className="text-sm text-muted-foreground">
                Post your questions and help others learn together
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-orange-100 dark:bg-orange-900 mb-4">
                <Search className="w-8 h-8 text-orange-600 dark:text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-sm text-muted-foreground">
                Personalized learning dashboard with recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Create Your Profile
              </h3>
              <p className="text-muted-foreground text-sm">
                Sign up and tell us what you want to learn. Add your interests
                to personalize your experience.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Explore & Learn</h3>
              <p className="text-muted-foreground text-sm">
                Search for any topic and access curated YouTube videos and
                articles to enhance your knowledge.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect & Grow</h3>
              <p className="text-muted-foreground text-sm">
                Join study groups, share resources, ask questions, and learn
                from a community of passionate learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of learners discovering educational resources and
            growing together.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-200"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
