import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {checkNickname, updateNickname} from '../src/utils/authApi';

vi.mock('../src/utils/authApi', () => ({
    checkNickname: vi.fn(),
    updateNickname: vi.fn(),
}));
vi.mock('../src/Context/ThemeContext', () => ({useTheme: () => ({isDark: false})}));

beforeEach(() => {
    vi.resetModules();
    checkNickname.mockResolvedValue(false);
    updateNickname.mockResolvedValue({});
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
});

async function showPopup(locale = 'ja-JP') {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(locale);
    const {default: NicknamePopup} = await import('../src/components/NicknamePopup/NicknamePopup');
    const onSubmit = vi.fn();
    render(<NicknamePopup initialNickname="" onSubmit={onSubmit}/>);
    return onSubmit;
}

describe.each([
    ['ko-KR', '환영합니다!', '중복확인', '시작하기', '중복 확인에 실패했습니다.', '이미 사용 중인 닉네임입니다.', '닉네임 설정에 실패했습니다.', '한글은 자음이나 모음만 따로 쓸 수 없습니다.'],
    ['ja-JP', 'ようこそ！', '確認', '始める', '確認に失敗しました。', 'このニックネームは既に使用されています。', 'ニックネームの設定に失敗しました。', 'ハングルの子音・母音を単独で使うことはできません。'],
    ['en-US', 'Welcome!', 'Check', 'Start', 'Failed to check nickname.', 'This nickname is already taken.', 'Failed to set nickname.', 'Standalone Korean consonants or vowels are not allowed.'],
])('%s nickname UI', (locale, title, check, start, checkFailed, duplicate, setFailed, jamo) => {
    it('renders the browser language and saves a Japanese nickname', async () => {
        const onSubmit = await showPopup(locale);
        expect(screen.getByRole('heading').textContent).toBe(title);
        fireEvent.change(screen.getByRole('textbox'), {target: {value: '  さくら  '}});
        fireEvent.click(screen.getByRole('button', {name: check, exact: true}));
        await waitFor(() => expect(screen.getByRole('button', {name: start}).disabled).toBe(false));
        fireEvent.click(screen.getByRole('button', {name: start}));
        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('さくら'));
        expect(updateNickname).toHaveBeenCalledWith('さくら');
    });

    it('localizes a failed availability check even when the API sends Korean', async () => {
        checkNickname.mockRejectedValue({response: {status: 500, data: {detail: '서버 오류입니다.'}}});
        await showPopup(locale);
        fireEvent.change(screen.getByRole('textbox'), {target: {value: 'さくら'}});
        fireEvent.click(screen.getByRole('button', {name: check, exact: true}));
        expect(await screen.findByText(checkFailed)).toBeTruthy();
        expect(screen.getByRole('button', {name: start}).disabled).toBe(true);
    });

    it.each([[409, duplicate], [500, setFailed]])('localizes a save failure with status %s', async (status, message) => {
        updateNickname.mockRejectedValue({response: {status, data: {detail: '한국어 서버 메시지'}}});
        const onSubmit = await showPopup(locale);
        fireEvent.change(screen.getByRole('textbox'), {target: {value: 'さくら'}});
        fireEvent.click(screen.getByRole('button', {name: check, exact: true}));
        await waitFor(() => expect(screen.getByRole('button', {name: start}).disabled).toBe(false));
        fireEvent.click(screen.getByRole('button', {name: start}));
        expect(await screen.findByText(message)).toBeTruthy();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('blocks standalone Hangul consonants or vowels without asking the server', async () => {
        await showPopup(locale);
        fireEvent.change(screen.getByRole('textbox'), {target: {value: 'ㅋㅋㅋ'}});
        fireEvent.click(screen.getByRole('button', {name: check, exact: true}));
        expect(await screen.findByText(jamo)).toBeTruthy();
        expect(checkNickname).not.toHaveBeenCalled();
        expect(screen.getByRole('button', {name: start}).disabled).toBe(true);
    });
});

it.each(['철수ㅋㅋ', 'ㅋㅋ123'])('blocks a nickname containing standalone Hangul jamo: %s', async (nickname) => {
    await showPopup();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: nickname}});
    fireEvent.click(screen.getByRole('button', {name: '確認', exact: true}));
    expect(await screen.findByText('ハングルの子音・母音を単独で使うことはできません。')).toBeTruthy();
    expect(checkNickname).not.toHaveBeenCalled();
});

it.each(['あ', 'か\u3099', '𠮷', 'あ'.repeat(11), 'か\u3099'.repeat(11), '𠮷'.repeat(11)])(
    'blocks a nickname outside 2–10 visible characters: %s', async (nickname) => {
        await showPopup();
        fireEvent.change(screen.getByRole('textbox'), {target: {value: nickname}});
        expect(screen.getByRole('button', {name: '確認', exact: true}).disabled).toBe(true);
        expect(screen.getByRole('button', {name: '始める'}).disabled).toBe(true);
    }
);

it.each(['かな', 'カナ', '漢字', 'か\u3099き\u3099', '𠮷田', 'あ'.repeat(10), 'か\u3099'.repeat(10), '𠮷'.repeat(10), '철수', '김철수12'])(
    'checks and saves a nickname with 2–10 visible characters: %s', async (nickname) => {
        const onSubmit = await showPopup();
        fireEvent.change(screen.getByRole('textbox'), {target: {value: nickname}});
        fireEvent.click(screen.getByRole('button', {name: '確認', exact: true}));
        await waitFor(() => expect(screen.getByRole('button', {name: '始める'}).disabled).toBe(false));
        expect(checkNickname).toHaveBeenCalledWith(nickname);
        fireEvent.click(screen.getByRole('button', {name: '始める'}));
        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(nickname));
        expect(updateNickname).toHaveBeenCalledWith(nickname);
    }
);

it('keeps an overlong nickname blocked if an earlier availability check finishes', async () => {
    let finishCheck;
    checkNickname.mockReturnValue(new Promise(resolve => { finishCheck = resolve; }));
    await showPopup();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'さくら'}});
    fireEvent.click(screen.getByRole('button', {name: '確認', exact: true}));
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'あ'.repeat(11)}});
    finishCheck(false);
    await screen.findByRole('button', {name: '確認', exact: true});
    expect(screen.getByRole('button', {name: '始める'}).disabled).toBe(true);
    expect(screen.queryByText('使用可能なニックネームです。')).toBeNull();
});

it('keeps a standalone-jamo nickname blocked if an earlier availability check finishes', async () => {
    let finishCheck;
    checkNickname.mockReturnValue(new Promise(resolve => { finishCheck = resolve; }));
    await showPopup();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'さくら'}});
    fireEvent.click(screen.getByRole('button', {name: '確認', exact: true}));
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'ㅋㅋㅋ'}});
    finishCheck(false);
    await screen.findByRole('button', {name: '確認', exact: true});
    expect(screen.getByRole('button', {name: '始める'}).disabled).toBe(true);
    expect(screen.queryByText('使用可能なニックネームです。')).toBeNull();
});
