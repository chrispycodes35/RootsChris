"use client"

import { useToast, ToastId, ToastPosition } from "@chakra-ui/react"

export const useToaster = () => {
  const toast = useToast()

  return {
    show: ({
      title,
      description,
      action,
      duration = 5000,
      isClosable = true,
    }: {
      title?: string
      description?: string
      action?: {
        label: string
        onClick: () => void
      }
      duration?: number
      isClosable?: boolean
    }): ToastId => {
      return toast({
        title,
        description,
        duration,
        isClosable,
        position: "bottom-end" as ToastPosition,
        ...(action && {
          render: ({ onClose }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                {title && <div style={{ fontWeight: 'bold' }}>{title}</div>}
                {description && <div>{description}</div>}
              </div>
              <button
                onClick={() => {
                  action.onClick()
                  onClose()
                }}
                style={{
                  padding: '4px 8px',
                  background: '#14e956',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {action.label}
              </button>
            </div>
          ),
        }),
      })
    },
  }
}
