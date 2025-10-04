import Bar from "@/components/BarComponent/BarComponent";
import StandingsComponent from "@/components/StandingsComponent/StandingsComponent";
import contestModule from "@/api/contest/contest";

/**
 * Contest Standings Page - Server Component
 * Displays the leaderboard for a specific contest
 * Public page - no authentication required
 *
 * @param {Object} props - Page props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.contestId - Contest ID from URL
 * @returns {JSX.Element} Standings page
 */
export default async function StandingsPage({ params }) {
  const { contestId } = await params;

  // Fetch standings data (public endpoint)
  const { data: standingsData, error: standingsError } =
    await contestModule.getContestStandings(contestId);

  // Fetch contest details for the title
  const { data: contestData, error: contestError } =
    await contestModule.getContest(contestId);

  if (standingsError || contestError) {
    return (
      <div className="min-h-screen">
        <Bar title="Standings" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-900/30 border border-red-500 rounded-lg px-6 py-4">
            <p className="text-red-300">
              {standingsError || contestError || "Failed to load standings"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const contestTitle = contestData?.contest?.title || "Contest";
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Contest Header */}
        <div className="mb-6 bg-zinc-800 rounded-lg px-6 py-5 border-b-4 border-orange-500 shadow-lg">
          <div className="text-center">
            <p className="text-sm text-zinc-400 uppercase tracking-wider mb-2">
              Standings
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
              {contestTitle}
            </h1>
          </div>
        </div>

        {/* Standings Table */}
        <div className="bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-800">
          <StandingsComponent standingsData={standingsData} />
        </div>
      </div>
    </div>
  );
}
