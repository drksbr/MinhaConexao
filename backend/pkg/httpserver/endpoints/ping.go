// endpoints/ping.go
package endpoints

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

// PingHandler lida com conexões WebSocket para ping e jitter
func PingHandler(c *websocket.Conn) {
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			// Se ocorrer um erro, feche a conexão
			break
		}
		// Echo de volta a mensagem recebida
		err = c.WriteMessage(mt, message)
		if err != nil {
			break
		}
	}
}

// PingHeadHandler lida com requisições HEAD para /ping
func PingHeadHandler(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNoContent)
}
