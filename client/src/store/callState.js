import { writable } from 'svelte/store';

const connectedClients = writable([]);

export default connectedClients;
