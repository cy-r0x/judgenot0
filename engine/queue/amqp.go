package queue

import (
	"encoding/json"
	"log"

	"github.com/judgenot0/judge-deamon/scheduler"
	"github.com/judgenot0/judge-deamon/structs"
	amqp "github.com/rabbitmq/amqp091-go"
)

type Queue struct {
	msgs      <-chan amqp.Delivery
	conn      *amqp.Connection
	ch        *amqp.Channel
	queueName string
}

func NewQueue() *Queue {
	return &Queue{}
}

func (q *Queue) InitQueue(queueName string, CPU_COUNT int) error {
	q.queueName = queueName

	var err error
	q.conn, err = amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Println(err)
		return err
	}

	q.ch, err = q.conn.Channel()
	if err != nil {
		log.Println(err)
		return err
	}

	err = q.ch.Qos(CPU_COUNT, 0, false)
	if err != nil {
		log.Println(err)
		return err
	}

	args := amqp.Table{
		"x-queue-type": "quorum",
	}
	_, err = q.ch.QueueDeclare(q.queueName, true, false, false, false, args)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (q *Queue) QueueMessage(submission []byte) error {
	err := q.ch.Publish(
		"",
		q.queueName,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        submission,
		},
	)
	return err
}

func (q *Queue) StartConsume(scheduler *scheduler.Scheduler) error {
	defer func() {
		if q.ch != nil {
			q.ch.Close()
		}
		if q.conn != nil {
			q.conn.Close()
		}
	}()

	var err error
	q.msgs, err = q.ch.Consume(q.queueName, "", false, false, false, false, nil)
	if err != nil {
		log.Println(err)
		return err
	}

	for d := range q.msgs {
		slave := <-scheduler.WorkChannel
		var submission structs.Submission
		err := json.Unmarshal(d.Body, &submission)
		if err != nil {
			log.Printf("Raw body: %s", string(d.Body))
			log.Printf("Invalid message body: %v", err)
			continue
		}
		go scheduler.Work(slave, submission, d)
	}

	return nil
}
