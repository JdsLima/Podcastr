import { createContext, useState, ReactNode } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    hasNext: boolean,
    hasPrevious: boolean,
    isLooping: boolean,
    isShuffling: boolean,
    touggleLoop: () => void;
    play: (episode: Episode) => void,
    tougglePlay: () => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrev: () => void;
    touggleShuffle: () => void;
    clearPlayerState: () => void;
};

type PlayerConstextProviderProps = {
    children: ReactNode;
};

export const PlayerConstext = createContext({} as PlayerContextData);

export function PlayerConstextProvider({ children }: PlayerConstextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, SetIsShuffling] = useState(false);
    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function tougglePlay() {
        setIsPlaying(!isPlaying);
    }

    function touggleLoop() {
        setIsLooping(!isLooping);
    }

    function touggleShuffle() {
        SetIsShuffling(!isShuffling);
    }

    function playNext() {
        if (isShuffling) {
            const nextRandonIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandonIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrev() {
        if (hasPrevious)
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }

    return (
        <PlayerConstext.Provider value={{
            episodeList, currentEpisodeIndex, play, isPlaying,
            tougglePlay, touggleShuffle, playList, playNext,
            playPrev, hasNext, hasPrevious, isLooping,
            touggleLoop, isShuffling, clearPlayerState
        }}>
            {children}
        </PlayerConstext.Provider>
    );
}