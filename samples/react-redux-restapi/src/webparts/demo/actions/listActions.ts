import { ActionTypes, Action } from './actionTypes';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import { IODataList } from '@microsoft/sp-odata-types';


//Action Creators to create and return Actions
export const updateTitle = (title: string): Action => ({
	type: ActionTypes.UPDATE_TITLE,
	payload: title
});

const addListRequest = (): Action => ({
	type: ActionTypes.ADD_LIST_REQUEST
});

const addListSuccess = (list: string): Action => ({
	type: ActionTypes.ADD_LIST_SUCCESS,
	payload: list
});

const addListError = (error: Error): Action => ({
	type: ActionTypes.ADD_LIST_ERROR,
	payload: error.message
});

const getListsRequest = (): Action => ({
	type: ActionTypes.GET_LISTS_REQUEST
});

const getListsSuccess = (lists: string[]): Action => ({
	type: ActionTypes.GET_LISTS_SUCCESS,
	payload: lists
});

const getListsError = (error: Error): Action => ({
	type: ActionTypes.GET_LISTS_ERROR,
	payload: error.message
});

export function addList(spHttpClient: SPHttpClient, currentWebUrl: string, listTitle: string) {
	return async (dispatch: any) => {

		dispatch(addListRequest());

		const spOpts: ISPHttpClientOptions = {
			body: `{ Title: '${listTitle}', BaseTemplate: 100 }`
		};

		try {
			const response: SPHttpClientResponse = await spHttpClient.post(`${currentWebUrl}/_api/web/lists`, SPHttpClient.configurations.v1, spOpts);
			const list: IODataList = await response.json();

			dispatch(addListSuccess(list.Title));

		} catch (error) {
			dispatch(addListError(error));
		}
	};
}

export function getLists(spHttpClient: SPHttpClient, currentWebUrl: string) {
	return async (dispatch: any) => {

		dispatch(getListsRequest());

		try {
			const response: SPHttpClientResponse = await spHttpClient.get(`${currentWebUrl}/_api/web/lists?$filter=Hidden eq false&$select=Title`, SPHttpClient.configurations.v1);
			const responseJSON = await response.json();
			const lists: IODataList[] = responseJSON.value;
			const listTitles: string[] = lists.map(list => list.Title);
			dispatch(getListsSuccess(listTitles));

		} catch (error) {
			dispatch(getListsError(error));
		}
	};
}