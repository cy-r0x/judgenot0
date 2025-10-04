package cmd

import (
	"io"
	"net/http"

	"github.com/judgenot0/judge-deamon/queue"
	"github.com/judgenot0/judge-deamon/utils"
)

type Server struct {
	manager *queue.Queue
}

func NewServer(queue *queue.Queue) *Server {
	return &Server{
		manager: queue,
	}
}

func (s *Server) handleSubmit(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	submission, err := io.ReadAll(r.Body)
	if err != nil {
		utils.SendResponse(w, http.StatusBadRequest, "Failed to read request body")
		return
	}

	err = s.manager.QueueMessage(submission)
	if err != nil {
		utils.SendResponse(w, http.StatusBadRequest, "Failed to Queue submission")
		return
	}
	utils.SendResponse(w, http.StatusOK, "")
}

func (s *Server) initRoute(mux *http.ServeMux) {
	mux.Handle("POST /submit", http.HandlerFunc(s.handleSubmit))
}

func (s *Server) Listen(port string) {
	mux := http.NewServeMux()
	s.initRoute(mux)
	http.ListenAndServe(port, mux)
}
