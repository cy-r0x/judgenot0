package languages

import (
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/judgenot0/judge-deamon/handlers"
	"github.com/judgenot0/judge-deamon/structs"
)

type Python struct {
}

func (p *Python) Compile(boxId int, submission *structs.Submission) error {
	code := submission.SourceCode
	boxPath := fmt.Sprintf("/var/local/lib/isolate/%d/box/", boxId)

	pyFilePath := filepath.Join(boxPath, "main.py")
	if err := os.WriteFile(pyFilePath, []byte(code), 0644); err != nil {
		log.Printf("Error writing code to file: %v", err)
		return errors.New("Error")
	}
	return nil
}

func (p *Python) Run(boxId int, submission *structs.Submission) {

	boxPath := fmt.Sprintf("/var/local/lib/isolate/%d/box/", boxId)

	var maxTime float32
	var maxRSS float32
	finalResult := "ac"

	inputPath := filepath.Join(boxPath, "in.txt")
	expectedOutputPath := filepath.Join(boxPath, "expOut.txt")
	outputPath := filepath.Join(boxPath, "out.txt")
	metaPath := filepath.Join(boxPath, "meta.txt")

	memLimit := submission.MemoryLimit * 1024

	for i, test := range submission.Testcases {

		input := test.Input
		output := test.ExpectedOutput

		os.WriteFile(inputPath, []byte(input), 0644)
		os.WriteFile(expectedOutputPath, []byte(output), 0644)
		os.WriteFile(outputPath, []byte(""), 0644)

		isolateCmd := exec.Command("isolate",
			fmt.Sprintf("--box-id=%d", boxId),
			"--stdin=in.txt",
			"--stdout=out.txt",
			fmt.Sprintf("--time=%.3f", submission.Timelimit),
			fmt.Sprintf("--wall-time=%.3f", (submission.Timelimit)*1.5),
			"--fsize=10240",
			fmt.Sprintf("--mem=%d", int(memLimit)),
			"--meta="+metaPath,
			"--run",
			"--",
			"/usr/bin/python3",
			"main.py",
		)
		_ = isolateCmd.Run()

		handlers.Compare(boxPath, &maxTime, &maxRSS, &finalResult, i)

		if finalResult != "Accepted" {
			break
		}
	}

	handlers.ProduceVerdict(submission, finalResult, &maxTime, &maxRSS)

}
