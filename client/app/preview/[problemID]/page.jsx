import ProblemPreviewComponent from "@/components/ProblemPreviewComponent/ProblemPreviewComponet";
import problemDataModule from "@/utils/fetchProblem";

export default async ({ params }) => {
  const { problemID } = await params;
  const problem = await problemDataModule.getProblem();

  return (
    <>
      <ProblemPreviewComponent problem={problem} problemID={problemID} />
    </>
  );
};
