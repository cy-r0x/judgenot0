package handlers

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

type Meta struct {
	Status    string
	Message   string
	Killed    int
	Time      float32
	Time_Wall float32
	Max_RSS   float32
}

func Compare(boxPath string, maxTime *float32, maxRSS *float32, finalResult *string, testCase int) {

	metaPath := fmt.Sprintf("%smeta.txt", boxPath)
	outputPath := fmt.Sprintf("%sout.txt", boxPath)
	expectedOutputPath := fmt.Sprintf("%sexpOut.txt", boxPath)

	metaContent, err := os.ReadFile(metaPath)
	if err != nil {
		log.Printf("Error reading meta file: %v", err)
		return
	}

	var meta Meta
	for line := range strings.SplitSeq(string(metaContent), "\n") {
		parts := strings.SplitN(line, ":", 2)
		if len(parts) != 2 {
			continue
		}
		switch parts[0] {
		case "status":
			meta.Status = parts[1]
		case "message":
			meta.Message = parts[1]
		case "killed":
			meta.Killed, _ = strconv.Atoi(parts[1])
		case "time":
			if v, err := strconv.ParseFloat(parts[1], 32); err == nil {
				meta.Time = float32(v)
			}
		case "time-wall":
			if v, err := strconv.ParseFloat(parts[1], 32); err == nil {
				meta.Time_Wall = float32(v)
			}
		case "max-rss":
			if v, err := strconv.ParseFloat(parts[1], 32); err == nil {
				meta.Max_RSS = float32(v)
			}
		}
	}

	if meta.Time > *maxTime {
		*maxTime = meta.Time
	}
	if meta.Max_RSS > *maxRSS {
		*maxRSS = meta.Max_RSS
	}

	if meta.Status != "" {
		switch meta.Status {
		case "RE":
			*finalResult = "re" //runtime error
		case "SG":
			*finalResult = "re" //runtime error
		case "TO":
			*finalResult = "tle" //time limit exceeded
		case "XX":
			*finalResult = "ie" //internal error
		}
		return
	}

	diffCmd := exec.Command("diff", "-Z", "-B", outputPath, expectedOutputPath)
	if _, err := diffCmd.CombinedOutput(); err != nil {
		*finalResult = "wa" //Wrong Answer
	}

}
