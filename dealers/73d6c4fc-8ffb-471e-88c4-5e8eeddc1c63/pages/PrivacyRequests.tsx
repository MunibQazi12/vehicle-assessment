import IframeSection from "../components/IframeSection"

export default function PrivacyRequests() {
  return (
    <>
      <main className="min-h-screen flex flex-col">
        <IframeSection
          src="https://consumer.complyauto.com/request-portal/52e1a873-8145-4963-97ae-7b44cf663f3a"
          title="Privacy Request Portal"
          fullViewport={true}
        />
      </main>
    </>
  )
}
