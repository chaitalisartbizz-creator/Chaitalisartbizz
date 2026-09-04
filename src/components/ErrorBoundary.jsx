import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check for Vercel chunk loading error (happens after new deployments)
    if (
      error && 
      error.message && 
      error.message.includes('Failed to fetch dynamically imported module')
    ) {
      const chunkFailedMessage = 'chunk_failed_reloaded';
      if (!sessionStorage.getItem(chunkFailedMessage)) {
        sessionStorage.setItem(chunkFailedMessage, 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 font-sans">
          <div className="bg-white border border-stone-200 rounded-3xl p-8 max-w-4xl w-full text-center shadow-xl flex flex-col items-center">
            <h1 className="text-3xl font-cinzel font-bold text-[#1A1A1A] mb-4">Oops! Something broke.</h1>
            <p className="text-stone-500 mb-6">We're sorry, an unexpected error occurred.</p>
            
            {this.state.error && (
              <div className="w-full text-left bg-red-50 rounded-xl p-4 mb-8 overflow-auto border border-red-200">
                <p className="text-red-600 font-bold mb-2 font-mono text-sm">{this.state.error.toString()}</p>
                <pre className="text-red-500/80 font-mono text-xs whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <button 
              onClick={() => window.location.href = '/'} 
              className="bg-[#1A1A1A] hover:bg-[#C9A84C] text-white font-bold py-3 px-8 rounded-xl transition-colors inline-block"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
