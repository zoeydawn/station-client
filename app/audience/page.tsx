import AudienceForm from '@/components/AudienceForm'

export default function AudiencePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Create Your Audience</h1>
        <p className="text-base-content/70">
          Define your target audience demographics to generate tailored
          marketing concepts.
        </p>
      </div>
      <AudienceForm />
    </div>
  )
}
