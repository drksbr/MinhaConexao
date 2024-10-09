package httpserver

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

type RequestInfo struct {
	XRealIP              string
	XForwardedSourcePort string
	Timestamp            string
}

func RequestInfoData() *RequestInfo {
	return &RequestInfo{}
}

func RequestInfoHandler(c *fiber.Ctx) error {
	data := RequestInfoData()
	data.XRealIP = c.Get("x-real-ip")
	if data.XRealIP == "" {
		data.XRealIP = c.IP()
	}
	data.XForwardedSourcePort = c.Get("x-forwarded-source-port")
	if data.XForwardedSourcePort == "" {
		data.XForwardedSourcePort = c.Port()
	}
	data.Timestamp = time.Now().Format(time.UnixDate)

	return c.Status(fiber.StatusOK).JSON(data)
}
