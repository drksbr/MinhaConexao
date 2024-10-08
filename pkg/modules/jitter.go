package modules

type JitterResult struct {
	Jitter float64 `json:"jitter"`
}

func CalculateJitter(delays []float64) JitterResult {
	var total float64
	for i := 1; i < len(delays); i++ {
		diff := delays[i] - delays[i-1]
		if diff < 0 {
			diff = -diff
		}
		total += diff
	}
	jitter := total / float64(len(delays)-1)
	return JitterResult{Jitter: jitter}
}
