export const SET_SHOW_TOAST = 'SET_SHOW_TOAST'

type ISetShowToast = (
    bool: boolean,
    options?: {
        text: string,
        duration?: number,
        backgroundOpacity?: number
        coverScreen?: boolean
    }
) => void

export const setShowToast: ISetShowToast = (bool, options = { text: "" }) => {
    const { text, duration, backgroundOpacity, coverScreen } = options
    return {
        type: SET_SHOW_TOAST,
        payload: {
            showToast: bool,
            text,
            duration,
            backgroundOpacity,
            coverScreen
        }
    }
}