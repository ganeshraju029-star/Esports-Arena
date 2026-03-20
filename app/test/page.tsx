export default function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Esports Arena - Test Page
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Frontend is working correctly!
        </p>
        <div className="space-y-4">
          <a href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Go to Homepage
          </a>
          <br />
          <a href="/login" className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
