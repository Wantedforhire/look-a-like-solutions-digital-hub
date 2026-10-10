import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("ErrorBoundary caught a render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="pt-40 pb-24 text-center min-h-screen bg-white px-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Something went wrong</h1>
          <p className="text-slate-500 mb-6">We couldn't display this page. Please try again.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-indigo-accent text-white font-semibold text-sm hover:bg-indigo-500"
          >
            Browse All Articles
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}