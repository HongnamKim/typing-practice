import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {checkNickname, getMyInfo, updateNickname} from '../src/utils/authApi';

const {updateUser} = vi.hoisted(() => ({updateUser: vi.fn()}));

vi.mock('../src/utils/authApi', () => ({
    checkNickname: vi.fn(),
    getMyInfo: vi.fn(),
    updateNickname: vi.fn(),
}));
vi.mock('../src/Context/ThemeContext', () => ({useTheme: () => ({isDark: false})}));
vi.mock('../src/Context/AuthContext', () => ({useAuth: () => ({updateUser})}));

const member = {nickname: '기존닉네임', email: 'user@example.com', role: 'USER', createdAt: '2026-01-01T00:00:00'};

beforeEach(() => {
    vi.resetModules();
    getMyInfo.mockResolvedValue({success: true, data: member, timestamp: '2026-10-10T00:00:00'});
    checkNickname.mockResolvedValue(false);
    updateNickname.mockResolvedValue({success: true, data: {...member, nickname: 'さくら'}, timestamp: '2026-10-10T00:00:00'});
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
});

async function showProfile(locale = 'ja-JP') {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(locale);
    const {default: ProfilePopup} = await import('../src/components/ProfilePopup/ProfilePopup');
    const onClose = vi.fn();
    render(<ProfilePopup onClose={onClose}/>);
    await screen.findByDisplayValue(member.nickname);
    return onClose;
}

describe.each([
    ['ko-KR', '중복확인', '저장하기', '중복 확인에 실패했습니다.', '이미 사용 중인 닉네임입니다.', '닉네임 수정에 실패했습니다.', '한글은 자음이나 모음만 따로 쓸 수 없습니다.'],
    ['ja-JP', '確認', '保存する', '確認に失敗しました。', 'このニックネームは既に使用されています。', 'ニックネームの変更に失敗しました。', 'ハングルの子音・母音を単独で使うことはできません。'],
    ['en-US', 'Check', 'Save', 'Failed to check nickname.', 'This nickname is already taken.', 'Failed to update nickname.', 'Standalone Korean consonants or vowels are not allowed.'],
])('%s profile nickname UI', (locale, check, save, checkFailed, duplicate, editFailed, jamo) => {
    it('localizes a failed availability check even when the API sends Korean', async () => {
        checkNickname.mockRejectedValue({response: {status: 500, data: {detail: '서버 오류입니다.'}}});
        await showProfile(locale);
        fireEvent.change(screen.getByRole('textbox'), {target: {value: 'さくら'}});
        fireEvent.click(screen.getByRole('button', {name: check, exact: true}));
        expect(await screen.findByText(checkFailed)).toBeTruthy();
        expect(screen.getByRole('button', {name: save}).disabled).toBe(true);
    });

    it.each([[409, duplicate], [500, editFailed]])('localizes a save failure with status %s', async (status, message) => {
        updateNickname.mockRejectedValue({response: {status, data: {detail: '한국어 서버 메시지'}}});
        const onClose = await showProfile(locale);
        fireEvent.change(screen.getByRole('textbox'), {target: {value: 'さくら'}});
        fireEvent.click(screen.getByRole('button', {name: check, exact: true}));
        await waitFor(() => expect(screen.getByRole('button', {name: save}).disabled).toBe(false));
        fireEvent.click(screen.getByRole('button', {name: save}));
        expect(await screen.findByText(message)).toBeTruthy();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('blocks standalone Hangul consonants or vowels without asking the server', async () => {
        await showProfile(locale);
        fireEvent.change(screen.getByRole('textbox'), {target: {value: 'ㅋㅋㅋ'}});
        fireEvent.click(screen.getByRole('button', {name: check, exact: true}));
        expect(await screen.findByText(jamo)).toBeTruthy();
        expect(checkNickname).not.toHaveBeenCalled();
        expect(screen.getByRole('button', {name: save}).disabled).toBe(true);
    });
});

it.each(['が'.repeat(10), '𠮷'.repeat(10), '철수'])(
    'checks and saves a nickname with 2–10 visible characters: %s', async (nickname) => {
        const onClose = await showProfile();
        fireEvent.change(screen.getByRole('textbox'), {target: {value: nickname}});
        fireEvent.click(screen.getByRole('button', {name: '確認', exact: true}));
        await waitFor(() => expect(screen.getByRole('button', {name: '保存する'}).disabled).toBe(false));
        expect(checkNickname).toHaveBeenCalledWith(nickname);
        fireEvent.click(screen.getByRole('button', {name: '保存する'}));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
        expect(updateNickname).toHaveBeenCalledWith(nickname);
        expect(updateUser).toHaveBeenCalledWith(expect.objectContaining({nickname}));
    }
);

it.each(['あ'.repeat(11), '𠮷'.repeat(11)])('blocks a nickname over 10 visible characters: %s', async (nickname) => {
    await showProfile();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: nickname}});
    expect(screen.getByRole('button', {name: '確認', exact: true}).disabled).toBe(true);
    expect(screen.getByText('ニックネームは2〜10文字です。')).toBeTruthy();
    expect(screen.getByRole('button', {name: '保存する'}).disabled).toBe(true);
});

it('keeps a standalone-jamo nickname blocked if an earlier availability check finishes', async () => {
    let finishCheck;
    checkNickname.mockReturnValue(new Promise(resolve => { finishCheck = resolve; }));
    await showProfile();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'さくら'}});
    fireEvent.click(screen.getByRole('button', {name: '確認', exact: true}));
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'ㅋㅋㅋ'}});
    finishCheck(false);
    await screen.findByRole('button', {name: '確認', exact: true});
    expect(screen.getByRole('button', {name: '保存する'}).disabled).toBe(true);
    expect(screen.queryByText('使用可能なニックネームです。')).toBeNull();
});
