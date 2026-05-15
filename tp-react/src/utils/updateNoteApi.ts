import apiClient from './apiClient';
import {ApiResponse} from '../types/api.types';
import {UpdateNote, UpdateNoteCursorResponse} from '../types/notice.types';

export const getLatestUpdateNote = async (): Promise<UpdateNote | null> => {
    const res = await apiClient.get<ApiResponse<UpdateNote | null>>('/update-notes/latest');
    return res.data.data;
};

interface GetUpdateNotesParams {
    cursorReleasedAt?: string;
    cursorId?: number;
    size?: number;
}

export const getUpdateNotes = async (
    params: GetUpdateNotesParams = {}
): Promise<UpdateNoteCursorResponse> => {
    const query = new URLSearchParams();
    if (params.cursorReleasedAt && params.cursorId !== undefined) {
        query.append('cursorReleasedAt', params.cursorReleasedAt);
        query.append('cursorId', String(params.cursorId));
    }
    query.append('size', String(params.size ?? 50));
    const res = await apiClient.get<ApiResponse<UpdateNoteCursorResponse>>(
        `/update-notes?${query.toString()}`
    );
    return res.data.data;
};
