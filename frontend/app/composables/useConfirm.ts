import { AdminConfirmModal } from '#components'

interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  danger?: boolean
}

export const useConfirm = () => {
  const overlay = useOverlay()
  const modal = overlay.create(AdminConfirmModal)

  return async (options: ConfirmOptions) => {
    const instance = modal.open(options)
    return Boolean(await instance.result)
  }
}
