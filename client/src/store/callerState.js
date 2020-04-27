import { writable } from 'svelte/store';

export let audio = writable(true);
export let video = writable(true);

export const setAudio = (audioStreamable) => audio.set(audioStreamable);

export const setVideo = (videoStreamable) => video.set(videoStreamable);

export default {
  audio,
  video,
  setAudio,
  setVideo
};
