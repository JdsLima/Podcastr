import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import styles from '../Player/styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { PlayerConstext } from '../../context/playerContext';
import { convertDuration } from '../../utils/converteDuration';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        tougglePlay,
        playNext,
        playPrev,
        hasNext,
        hasPrevious,
        isLooping,
        touggleLoop,
        isShuffling,
        touggleShuffle,
        clearPlayerState
    } = useContext(PlayerConstext);

    function setupProgress() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleProgress(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="playing" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={492}
                        height={392}
                        src={episode.thumbnail}
                        objectFit='cover'
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDuration(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleProgress}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDuration(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        ref={audioRef}
                        src={episode.url}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        onLoadedMetadata={setupProgress}
                    />
                )}
                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length == 1}
                        className={isShuffling ? styles.isactive : ''}
                        onClick={touggleShuffle}
                    >
                        <img src="/shuffle.svg" alt="embaralhar" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !hasPrevious}
                        onClick={playPrev}
                    >
                        <img src="/play-previous.svg" alt="tocar anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={tougglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="tocar" />
                            : <img src="/play.svg" alt="tocar" />
                        }
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !hasNext}
                        onClick={playNext}
                    >
                        <img src="/play-next.svg" alt="tocar proxima" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        className={isLooping ? styles.isactive : ''}
                        onClick={touggleLoop}
                    >
                        <img src="/repeat.svg" alt="repetir" />
                    </button>
                </div>
            </footer>
        </div >
    );
}