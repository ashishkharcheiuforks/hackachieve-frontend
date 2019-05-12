import API from "../classes/API";
import {LOAD_CATEGORIES, LOAD_GOALS, SHOW_ALERT} from "./types";


export const loadGoals = (id, status) => async (dispatch, getState) => {

    /*
    load both short term and long term goals from a specific goal status
    if id = 0 it will load all goals from a specific user
     status available are:

    - all (all status below)
    - standby
    - ongoing
    - completed
    */
    return API.request(`/boards/show/${id}/${status}`, 'GET', null, 'auth').then((response) => {
        dispatch({type: LOAD_GOALS, payload: response.data})
    });
};


export const deleteGoal = (id) => async (dispatch) => {

    // await auth_axios.delete(`/goals/delete/${id}`); //send request to server
    return API.request(`/goals/delete/${id}/`, 'DELETE', null, 'auth')
};

export const deleteLongTermGoal = (id) => async (dispatch) => {

    // await auth_axios.delete(`/goals/delete/${id}`); //send request to server
    return API.request(`/columns/delete/${id}/`, 'DELETE', null, 'auth')
};

export const loadUserGoalsCategories = () => async (dispatch) => {

    return API.request(`/boards/`, 'GET', null, 'auth').then((response) => {

        dispatch({type: LOAD_CATEGORIES, payload: response.data})

    });

};

export const goalChangeStatus = (goalId, status) => async (dispatch) => {

    return API.request(`/goals/update-status/${goalId}/${status}`, 'PATCH', null, 'auth').then((response) => {

        console.log(response);

    });


};

export const goalSetPriority = (goalId, newPriority) => async (dispatch) => {

    console.log('action: goalSetPriority');

    return API.request(`/goals/update-priority/${goalId}/${newPriority}`, 'PATCH', null, 'auth').then((response) => {

        console.log(response);

    });


};


export const createGoal = (data) => async (dispatch) => {

    return API.request('/goals/create/', 'POST', data, 'auth').then((response) => {

        const {status, message} = response.data;

        dispatch({
            type: SHOW_ALERT, payload: {
                type: (status === 'success' ? 'positive' : 'negative'),
                title: (status === 'success' ? 'Your goal was created!' : 'Oops!'),
                content: message
            }
        });

        return response;
    });

};

export const createLongTermGoal = (data) => async (dispatch) => {

    console.log('Action: createLongTermGoal');

    return API.request('/columns/create/', 'POST', data, 'auth').then((response) => {

        const {status, message} = response.data;

        dispatch({
            type: SHOW_ALERT, payload: {
                type: (status === 'success' ? 'positive' : 'negative'),
                title: (status === 'success' ? 'Your long term goal was created!' : 'Oops!'),
                content: message
            }
        });

        return response;
    });

};

