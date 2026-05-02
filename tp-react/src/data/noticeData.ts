import {lang} from '@/utils/i18n';

interface LocalizedText {
    ko: string;
    ja: string;
    en: string;
}

export interface Notice {
    id: string; // localStorage 키 식별자, 한 번 정하면 변경 금지
    date: string; // YYYY-MM-DD
    title: LocalizedText;
    content: LocalizedText;
    showPopup: boolean; // false면 공지 페이지에만 노출
    actionLink?: {
        label: LocalizedText;
        url: string; // 내부 라우트 또는 외부 URL
    };
}

export const noticeList: Notice[] = [
    {
        id: 'copyright-policy-2026-05',
        date: '2026-05-02',
        showPopup: true,
        title: {
            ko: '저작권 정책 안내',
            ja: '著作権ポリシーのご案内',
            en: 'Copyright Policy Notice',
        },
        content: {
            ko: '문장 업로드 시 타인의 저작권이 있는 콘텐츠(노래 가사, 시, 소설, 기사 등)를 무단으로 업로드하지 마세요.\n출처를 표시하더라도 저작권자의 허락 없는 업로드는 권리 침해에 해당합니다.\n업로드한 콘텐츠로 인한 모든 법적 책임은 업로드한 본인에게 있으며, 권리 침해 신고가 접수되거나 부적절한 콘텐츠로 판단되는 경우 사전 통보 없이 비공개 또는 삭제될 수 있습니다.',
            ja: '文章のアップロード時に、他人の著作権がある内容(歌詞、詩、小説、記事など)を無断でアップロードしないでください。出典を表示しても、著作権者の許諾なしのアップロードは権利侵害に該当します。\nアップロードした内容に対するすべての法的責任はアップロードした本人にあり、権利侵害の通報を受けたり、不適切な内容と判断された場合、事前の通知なしに非公開または削除されることがあります。',
            en: 'When uploading sentences, do not upload copyrighted content (lyrics, poems, novels, articles, etc.) without permission. Citing the source does not exempt unauthorized uploads from being infringement.\nYou are solely responsible for any legal consequences of uploaded content. Content may be hidden or removed without prior notice upon receipt of infringement reports or if deemed inappropriate.',
        },
        actionLink: {
            label: {ko: '약관 보기', ja: '利用規約を見る', en: 'View Terms'},
            url: '/terms',
        },
    },
];

/**
 * showPopup이 true인 가장 최근 공지 (사용자가 아직 안 본 것)를 반환
 */
export const getLatestUnreadPopupNotice = (readNoticeIds: string[]): Notice | null => {
    const popupNotices = noticeList.filter(n => n.showPopup);
    if (popupNotices.length === 0) return null;
    // 최신순(date desc) 정렬 후 안 본 것 중 첫 번째
    const sorted = [...popupNotices].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(n => !readNoticeIds.includes(n.id)) || null;
};

/**
 * 현재 언어로 LocalizedText 추출
 */
export const localized = (text: LocalizedText): string => {
    return text[lang];
};
