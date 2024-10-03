import { reactive } from "vue";

const state = reactive({
    user: null,
});

const setUser = (userData) => {
    state.user = userData;
};

export default {
    state,
    setUser,
};
