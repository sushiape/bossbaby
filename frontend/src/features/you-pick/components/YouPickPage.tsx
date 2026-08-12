import type { RoutePageProps } from "../../../app/routes";
import Footer from "../../../shared/components/Footer";
import Header from "../../../shared/components/Header";
import { useParticipant } from "../hooks/useParticipant";
import { useSuggestions } from "../hooks/useSuggestions";
import { useVotes } from "../hooks/useVotes";
import { ResultsPanel } from "./ResultsPanel";
import { SuggestionsPanel } from "./SuggestionsPanel";
import { VotePanel } from "./VotePanel";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-[1100px] mx-auto px-4 sm:px-6">{children}</div>
);

export default function YouPickPage({ currentPage, setCurrentPage }: RoutePageProps) {
  const participant = useParticipant();
  const suggestions = useSuggestions(participant.initialized);
  const votes = useVotes(participant.initialized);

  return (
    <div className="min-h-screen bg-[#FFD2E9] text-[#1f1f1f] font-[Poppins,sans-serif]">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="py-20 px-4">
        <Container>
          <div className="max-w-[900px] mx-auto text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-[-0.02em]">You pick. We make.</h1>
            <p className="text-lg text-gray-700 leading-relaxed">Design next BIG (or petit) thing with us.</p>
            {participant.error && (
              <div role="alert" className="mt-3 text-sm text-red-700">
                <p>{participant.error}</p>
                <button type="button" onClick={participant.retry} className="font-semibold underline mt-1">Retry sign-in</button>
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <VotePanel
              participantReady={participant.ready}
              participantHasVoted={votes.results?.participantHasVoted === true}
              submitting={votes.submitting}
              error={votes.error}
              feedback={votes.feedback}
              onSubmit={votes.submit}
            />
            <ResultsPanel results={votes.results} loading={votes.loading} error={votes.error} onRetry={votes.retry} />
          </div>
          <SuggestionsPanel participantReady={participant.ready} controller={suggestions} />
        </Container>
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
