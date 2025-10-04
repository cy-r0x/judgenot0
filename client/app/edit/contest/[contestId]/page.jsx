"use client";

import { use } from "react";
import ContestEditComponent from "@/components/ContestEditComponent/ContestEditComponent";
import { withRole } from "@/components/HOC/withAuth";
import { USER_ROLES } from "@/utils/constants";

function EditContest({ params }) {
  const { contestId } = use(params);

  return (
    <div>
      <ContestEditComponent contestId={contestId} />
    </div>
  );
}

export default withRole(EditContest, USER_ROLES.ADMIN);
