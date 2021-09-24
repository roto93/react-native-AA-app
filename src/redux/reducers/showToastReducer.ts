import * as Action from '../action'

const initState = {
    showToast: false,
    options: {
        text: '',
    }
}

const showToastReducer = (state = initState, action) => {
    switch (action.type) {
        case Action.SET_SHOW_TOAST:
            const { showToast, text, duration, backgroundOpacity, coverScreen } = action.payload
            return {
                ...state,
                showToast,
                options: {
                    text,
                    duration,
                    backgroundOpacity,
                    coverScreen
                }
            }

        default:
            return state
    }

}

export default showToastReducer