import { useEffect, useState } from "react";

interface useQueryParamStateProps<T> {
	defaultState: T;
}

export function useQueryParamState<T>(name: string, defaultState: T): [T, (val: T) => void] {
	// TODO: If we have values on the query params, load those into default state instead of using the value passed in

	const [myState, setMyState] = useState(defaultState);
	//document.location.search = `${name}=${myState}`;

	const setToState = (newValue: T) => {
		if (typeof newValue === 'string' || typeof newValue === 'number' || typeof newValue === 'boolean') {
			var searchParams = new URLSearchParams(window.location.search);
			searchParams.set(name, newValue.toString());
			window.history.replaceState(null, '', '?' + searchParams.toString());
			setMyState(newValue);
		}
	};

	// useEffect(() => {
	// 	console.log('useEffect', Date.now());
	// 	if (typeof myState === 'string' || typeof myState === 'number' || typeof myState === 'boolean') {
	// 		//const myStateString = myState.toString();
	// 		var searchParams = new URLSearchParams(window.location.search);
	// 		searchParams.set(name, myState.toString());
	// 		window.location.search = searchParams.toString();
	// 	}
	// }, []);

	return [myState, setToState];
};

// const useQueryParamState = (defaultState: T) => {
// 	const [myState, setMyState] = useState<T>(defaultState);
// 	return [myState, setMyState];
// };

// export default useQueryParamState;
