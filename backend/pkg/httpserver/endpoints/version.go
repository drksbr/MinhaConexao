package endpoints

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

type Version struct {
	Version  string
	Revision string
	BuildAt  time.Time
}

func NewVersionData() *Version {
	return &Version{}
}

// VersionHandler é um handler que renderiza a página inicial
func VersionHandler(c *fiber.Ctx) error {

	// Informações da página inicial
	data := NewVersionData()
	data.Version = "v1.0.0"
	data.Revision = "1"
	data.BuildAt = time.Now()

	// Retorna data em JSON
	return c.Status(fiber.StatusOK).JSON(data)
}
