import { useEffect, useState } from "react";

interface useQueryParamStateProps<T> {
	defaultState: T;
}

export function useQueryParamState<T>(
	name: string,
	type: 'string' | 'boolean' | 'number',
	defaultState: T,
): [T, (val: T) => void] {
	// TODO: If we have values on the query params, load those into default state instead of using the value passed in
	const searchParams = new URLSearchParams(window.location.search);
	let valueFromParam = searchParams.get(name);
	let typedValueFromParam: T = defaultState;
	if (valueFromParam && type === 'string') {
		typedValueFromParam = valueFromParam as T;
	}
	// if (valueFromParam && type === 'boolean') {
	// 	typedValueFromParam = valueFromParam === true as T;
	// }
	if (valueFromParam && type === 'number') {
		typedValueFromParam = parseInt(valueFromParam) as T;
	}
	const initialState = typedValueFromParam ?? defaultState;
	const [myState, setMyState] = useState(initialState);
	//document.location.search = `${name}=${myState}`;

	const setToState = (newValue: T) => {
		if (typeof newValue === 'string' || typeof newValue === 'number' || typeof newValue === 'boolean') {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set(name, newValue.toString());
			window.history.replaceState(null, '', '?' + searchParams.toString());
			setMyState(newValue);
		}
	};

	return [myState, setToState];
};

// const useQueryParamState = (defaultState: T) => {
// 	const [myState, setMyState] = useState<T>(defaultState);
// 	return [myState, setMyState];
// };

// export default useQueryParamState;
