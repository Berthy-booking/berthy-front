/******************************************************************************
 * Copyright (c) - 2020 - Mikhail Shubov.                                     *
 * Berthy project. All Rights Reserved.                                       *
 * The code in amenities.store.js is proprietary and confidential.            *
 * Unauthorized copying of the file and any parts of it                       *
 * as well as the project itself is strictly prohibited.                      *
 * Written by Mikhail Shubov <mpshubov@gmail.com>, 5 / 2020                   *
 ******************************************************************************/

import BerthyAPI from "../../services/berthy-api";

// State initial object
const initialState = () => ({
    amenities: [],
    lastUpdate: null,
    length: 0,
    icons: new Map([
        ["atm", "mdi-atm"],
        ["accessible", "mdi-wheelchair-accessibility"],
        ["bathtub", "mdi-shower-head"],
        ["wifi", "mdi-wifi"],
        ["ev_station", "mdi-flash-circle"],
        ["hotel", "mdi-bed"],
        ["restaurant", "mdi-silverware-fork-knife"],
        ["bar", "mdi-glass-cocktail"],
        ["gas_station", "mdi-gas-station"],
        ["parking", "mdi-parking"],
        ["water", "mdi-water"],
        ["bicycle_rental", "mdi-bike"],
        ["car_rental", "mdi-car"],
        ["grocery_store", "mdi-storefront-outline"],

        ["car_electric", "mdi-car-electric"],

        ["default", "mdi-help"]
    ])
});


/* Module amenities.store.js */


// VUEX STATE
const state = initialState();


// VUEX GETTERS
const getters = {
    getAmenities(state) {
        return state.amenities;
    },
    getIcons(state) {
        return state.icons;
    },
    lastUpdate(state) {
        return state.lastUpdate;
    },
    getLength(state) {
        return state.length;
    }
};


// VUEX ACTIONS
const actions = {
    reset({ commit }) {
        commit('RESET');
    },
    async availableAmenities({ commit }) {
        let response = await BerthyAPI.get('amenities');
        if (response.data.success) {
            commit('UPDATE_AMENITIES', response.data.data);
        }
    },
    async getAmenitiesByKeys({state}, value) {
        let array = [];
        for(let i = 0; i< state.amenities.length;i++) {
            for(let j=0; j<value.length;j++) {
                if(value[j]===state.amenities[i].key) {
                    array.push({
                        key: state.amenities[i].key,
                        value: state.amenities[i].value
                    });
                    break;
                }
            }
        }
        console.log(array);
        return array;
    },
};


// VUEX MUTATIONS
const mutations = {
    RESET(state) {
        const newState = initialState();
        Object.keys(newState).forEach(key => {
            state[key] = newState[key]
        });
    },
    UPDATE_AMENITIES(state,data) {
        state.amenities = data;
        state.amenities.forEach(amenity => {
            let icon = state.icons.get(amenity.key);
            icon = icon ? icon : state.icons.get("default");
            amenity.icon = icon;
        });
        state.length = data.length;
        state.lastUpdate = Date.now();
    }
};


export default {
    state,
    getters,
    actions,
    mutations
};
