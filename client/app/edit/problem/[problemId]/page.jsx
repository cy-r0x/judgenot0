"use client";

import { use } from "react";
import ProblemEditComponent from "@/components/ProblemEditComponent/ProblemEditComponent";
import { withRole } from "@/components/HOC/withAuth";
import { USER_ROLES } from "@/utils/constants";

function EditProblem({ params }) {
  const { problemId } = use(params);

  return (
    <div className="my-4">
      <ProblemEditComponent problemId={problemId} />
    </div>
  );
}

export default withRole(EditProblem, [USER_ROLES.SETTER, USER_ROLES.ADMIN]);
