"use client";

/**
 * Standings Component - Display contest leaderboard
 *
 * @param {Object} props - Component props
 * @param {Object} props.standingsData - Standings data from API
 * @param {number} props.standingsData.contest_id - Contest ID
 * @param {number} props.standingsData.total_problem_count - Total number of problems
 * @param {Array} props.standingsData.standings - Array of user standings
 * @returns {JSX.Element} Standings table component
 */
export default function StandingsComponent({ standingsData }) {
  const { total_problem_count, standings } = standingsData;

  // Generate problem letters (A, B, C, ...)
  const problemLetters = Array.from({ length: total_problem_count }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Helper function to get problem data for a user
  const getProblemData = (problems, problemIndex) => {
    return problems.find((p) => p.problem_index === problemIndex + 1);
  };

  // Helper function to format problem cell
  const formatProblemCell = (problemData) => {
    if (!problemData) {
      return { display: "-", className: "" };
    }

    if (problemData.solved) {
      const attempts = problemData.attempts > 1 ? problemData.attempts - 1 : "";
      const penalty = problemData.penalty;

      return {
        display: (
          <div className="flex flex-col items-center">
            <span className="font-semibold text-green-400 flex items-center gap-1">
              {problemData.first_blood && (
                <span className="text-yellow-400">★</span>
              )}
              <span>+{attempts && attempts}</span>
            </span>
            <span className="text-xs text-zinc-400">{penalty}</span>
          </div>
        ),
        className: "bg-green-900/30 hover:bg-green-900/50",
      };
    } else if (problemData.attempts > 0) {
      return {
        display: (
          <div className="flex flex-col items-center">
            <span className="font-semibold text-red-400">
              -{problemData.attempts}
            </span>
          </div>
        ),
        className: "bg-red-900/30 hover:bg-red-900/50",
      };
    }

    return { display: "-", className: "" };
  };

  if (!standings || standings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-400 text-lg">No standings available yet</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-zinc-800 border-b-2 border-orange-500">
            <th className="px-4 py-3 text-left font-semibold text-sm sticky left-0 bg-zinc-800 z-10">
              Rank
            </th>
            <th className="px-4 py-3 text-left font-semibold text-sm sticky left-[60px] bg-zinc-800 z-10 min-w-[200px]">
              Username
            </th>
            <th className="px-4 py-3 text-center font-semibold text-sm">
              Solved
            </th>
            <th className="px-4 py-3 text-center font-semibold text-sm">
              Penalty
            </th>
            {problemLetters.map((letter, index) => (
              <th
                key={index}
                className="px-4 py-3 text-center font-semibold text-sm min-w-[80px]"
              >
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((user, index) => (
            <tr
              key={user.user_id}
              className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors"
            >
              <td className="px-4 py-3 text-center font-semibold sticky left-0 bg-zinc-900 z-10">
                {index + 1}
              </td>
              <td className="px-4 py-3 font-medium sticky left-[60px] bg-zinc-900 z-10">
                {user.username}
              </td>
              <td className="px-4 py-3 text-center font-semibold text-green-400">
                {user.solved_count}
              </td>
              <td className="px-4 py-3 text-center font-medium text-zinc-300">
                {user.total_penalty}
              </td>
              {problemLetters.map((_, problemIndex) => {
                const problemData = getProblemData(user.problems, problemIndex);
                const cellData = formatProblemCell(problemData);

                return (
                  <td
                    key={problemIndex}
                    className={`px-4 py-3 text-center transition-colors ${cellData.className}`}
                  >
                    {cellData.display}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
