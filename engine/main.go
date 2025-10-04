package main

import (
	"log"
	"sync"

	"github.com/judgenot0/judge-deamon/cmd"
	"github.com/judgenot0/judge-deamon/config"
	"github.com/judgenot0/judge-deamon/queue"
	"github.com/judgenot0/judge-deamon/scheduler"
)

func main() {

	config := config.GetConfig()
	manager := queue.NewQueue()
	err := manager.InitQueue(config.QueueName, config.WorkerCount)

	if err != nil {
		log.Println(err)
		return
	}

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		scheduler := scheduler.NewScheduler()
		scheduler.With(config.WorkerCount)
		log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
		err := manager.StartConsume(scheduler)
		if err != nil {
			log.Println(err)
			return
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		server := cmd.NewServer(manager)
		log.Println("Server Running at " + config.HttpPort)
		server.Listen(config.HttpPort)
	}()

	wg.Wait()
}
