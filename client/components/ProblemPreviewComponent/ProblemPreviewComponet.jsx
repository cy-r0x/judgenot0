import ProblemViewComponent from "../ProblemViewComponent/ProblemViewComponent";
import Bar from "../BarComponent/BarComponent";
import Button from "../ButtonComponent/Button";
import Link from "next/link";
export default async function ProblemPreviewComponent({ problem, problemID }) {
  return (
    <>
      <div className="flex gap-8 px-32">
        <div className="border-2 border-zinc-800 my-6">
          <ProblemViewComponent problem={problem} />
        </div>
        <div className=" w-full h-48 mt-6 space-y-2">
          <div>
            <Bar title={"Editor Section"} />
            <div className="border-2 border-zinc-800 flex gap-4 p-4 mt-2">
              <Link href={`/edit/${problemID}`}>
                <Button name={"Edit"} />
              </Link>
              <Button
                name={"Share"}
                bgColor="bg-zinc-800"
                hoverColor="bg-zinc-700"
              />
            </div>
          </div>
          <div>
            <Bar title={"Submit"} />
            <div className="space-y-2 border-2 border-zinc-800 p-4 mt-2">
              <select
                name="language"
                id="language-select"
                className="p-2 border rounded w-full bg-zinc-800"
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <input
                type="file"
                className="p-2 border-2 border-zinc-800 rounded"
              ></input>
              <Button name={"Submit"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
