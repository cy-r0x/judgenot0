import contestModule from "@/api/contest/contest";
import Bar from "@/components/BarComponent/BarComponent";
import ContestListComponent from "@/components/ContestListComponent/ContestListComponent";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import EmptyState from "@/components/EmptyState/EmptyState";

async function Contest() {
  const response = await contestModule.getContests();

  // Handle error case
  if (response.error) {
    return (
      <div className="mx-8 my-4">
        <Bar title={"Contests"} />
        <div className="mt-6">
          <ErrorMessage
            message={response.error}
            type="error"
            fullWidth={true}
          />
        </div>
      </div>
    );
  }

  const contests = response.data || [];

  return (
    <>
      <div className="mx-8 my-4">
        <Bar title={"Contests"}></Bar>
        <div className="flex flex-col gap-2 my-4">
          {contests.length > 0 ? (
            contests.map((contest) => (
              <Link href={`/contests/${contest.id}`} key={contest.id}>
                <div>
                  <ContestListComponent data={contest} />
                </div>
              </Link>
            ))
          ) : (
            <EmptyState
              title="No Contests Available"
              description="Check back later for upcoming contests"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Contest;
