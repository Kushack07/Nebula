

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { AnimatedList } from "@/components/ui/animated-list"

export interface Notification {
  id: string
  message: string
  type?: "success" | "error" | "info"
}

interface NotificationContextType {
  addNotification: (message: string, type?: "success" | "error" | "info") => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{ addNotification, clearNotifications }}>
      {children}
      {notifications.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm">
          <AnimatedList delay={500} className="flex flex-col gap-2 p-2 sm:p-0">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${notification.type === "success"
                    ? "bg-green-500/10 border-green-500/20 text-green-500"
                    : notification.type === "error"
                      ? "bg-red-500/10 border-red-500/20 text-red-500"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                  }`}
              >
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            ))}
          </AnimatedList>
        </div>
      )}
    </NotificationContext.Provider>
  )
}
