class WebSocketService {
  constructor() {
    this.ws = null
    this.listeners = {}   // event type → callback
    this.userId = null
  }

  connect(userId) {
    if (this.ws?.readyState === WebSocket.OPEN) return
    this.userId = userId
    this.ws = new WebSocket(`ws://localhost:8080/ws/${userId}`)

    this.ws.onopen = () => {
      console.log('[WS] Connected')
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // Fire all listeners for this event type
        const handlers = this.listeners[data.type] || []
        handlers.forEach(fn => fn(data))
      } catch (e) {
        console.error('[WS] Parse error', e)
      }
    }

    this.ws.onclose = () => {
      console.log('[WS] Disconnected — reconnecting in 3s')
      setTimeout(() => this.connect(userId), 3000)
    }

    this.ws.onerror = (err) => {
      console.error('[WS] Error', err)
    }
  }

  on(eventType, callback) {
    if (!this.listeners[eventType]) this.listeners[eventType] = []
    this.listeners[eventType].push(callback)
    // Return unsubscribe function
    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(fn => fn !== callback)
    }
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
    this.listeners = {}
  }
}

// Single global instance
export const wsService = new WebSocketService()