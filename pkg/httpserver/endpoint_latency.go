package httpserver

import (
	"github.com/gofiber/fiber/v2"
)

func LatencyHandler(c *fiber.Ctx) error {
	// Respond quickly with an empty JSON object to measure latency
	return c.SendStatus(fiber.StatusNoContent)
}
