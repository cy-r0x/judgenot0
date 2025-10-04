import { RiGroupLine } from "react-icons/ri";

function ProblemComponent({ problemData, index }) {
  return (
    <>
      <div className="border-4 border-zinc-800 px-3 py-3 bg-zinc-800 flex items-center justify-between hover:border-orange-500 cursor-pointer transition-all">
        <div className="flex gap-5 items-center">
          <p className="text-4xl font-semibold">
            {String.fromCharCode("A".charCodeAt(0) + index - 1)}
          </p>
          <p>{problemData.title}</p>
        </div>
        {/* <div className="flex gap-1 items-center">
          <RiGroupLine size={20} />
          <p>x20</p>
        </div> */}
      </div>
    </>
  );
}

export default ProblemComponent;
