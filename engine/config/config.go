package config

import (
	"log"
	"os"
	"strconv"

	env "github.com/joho/godotenv"
)

type Config struct {
	WorkerCount int
	QueueName   string
	HttpPort    string
}

func loadConfig() Config {
	err := env.Load()
	if err != nil {
		log.Fatalln("Env is not correct")
	}

	var config Config

	workerCountStr := os.Getenv("WORKER_COUNT")
	workerCount, err := strconv.Atoi(workerCountStr)
	if err != nil {
		log.Println("Invalid WORKER_COUNT, using default value 1")
		workerCount = 1
	}
	config.WorkerCount = workerCount

	config.QueueName = os.Getenv("QUEUE_NAME")
	if config.QueueName == "" {
		config.QueueName = "judge_queue"
		log.Println("QUEUE_NAME not set, using default: judge_queue")
	}

	config.HttpPort = os.Getenv("HTTP_PORT")
	if config.HttpPort == "" {
		config.HttpPort = "8000"
		log.Println("HTTP_PORT not set, using default: 8000")
	}

	return config
}

func GetConfig() Config {
	return loadConfig()
}
