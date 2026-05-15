import apiClient from './apiClient';
import {ApiResponse} from '../types/api.types';
import {
    AnnouncementLatest,
    AnnouncementDetail,
    AnnouncementCursorResponse,
    PinnedAnnouncementListResponse,
} from '../types/notice.types';

export const getLatestAnnouncement = async (): Promise<AnnouncementLatest | null> => {
    const res = await apiClient.get<ApiResponse<AnnouncementLatest | null>>('/announcements/latest');
    return res.data.data;
};

export const getPinnedAnnouncements = async (): Promise<PinnedAnnouncementListResponse> => {
    const res = await apiClient.get<ApiResponse<PinnedAnnouncementListResponse>>('/announcements/pinned');
    return res.data.data;
};

interface GetAnnouncementsParams {
    cursorPostedAt?: string;
    cursorId?: number;
    size?: number;
}

export const getAnnouncements = async (
    params: GetAnnouncementsParams = {}
): Promise<AnnouncementCursorResponse> => {
    const query = new URLSearchParams();
    if (params.cursorPostedAt && params.cursorId !== undefined) {
        query.append('cursorPostedAt', params.cursorPostedAt);
        query.append('cursorId', String(params.cursorId));
    }
    query.append('size', String(params.size ?? 50));
    const res = await apiClient.get<ApiResponse<AnnouncementCursorResponse>>(
        `/announcements?${query.toString()}`
    );
    return res.data.data;
};

export const getAnnouncement = async (id: number): Promise<AnnouncementDetail> => {
    const res = await apiClient.get<ApiResponse<AnnouncementDetail>>(`/announcements/${id}`);
    return res.data.data;
};
