export interface LocalizedText {
    ko: string;
    en: string | null;
    ja: string | null;
}

export interface AnnouncementLatest {
    id: number;
    postedAt: string;
    title: LocalizedText;
    content: LocalizedText;
    published: boolean;
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AnnouncementSummary {
    id: number;
    postedAt: string;
    title: LocalizedText;
    published: boolean;
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AnnouncementDetail extends AnnouncementSummary {
    content: LocalizedText;
}

export interface PinnedAnnouncementListResponse {
    items: AnnouncementSummary[];
}

export interface AnnouncementCursor {
    postedAt: string;
    id: number;
}

export interface AnnouncementCursorResponse {
    content: AnnouncementSummary[];
    nextCursor: AnnouncementCursor | null;
    hasNext: boolean;
}

export interface UpdateNote {
    id: number;
    version: string;
    releasedAt: string;
    newFeatures: LocalizedText[];
    improvements: LocalizedText[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateNoteCursor {
    releasedAt: string;
    id: number;
}

export interface UpdateNoteCursorResponse {
    content: UpdateNote[];
    nextCursor: UpdateNoteCursor | null;
    hasNext: boolean;
}
