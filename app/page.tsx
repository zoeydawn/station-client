import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">Station</h1>
          <p className="text-lg mb-8">
            Generate AI-powered marketing concepts tailored to your audience
            demographics
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/audience" className="btn btn-primary btn-lg">
              Create Audience
            </Link>
            <Link href="/concepts" className="btn btn-outline btn-lg">
              View Concepts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
