export interface MessageReader {
	read: () => Promise<void>;
}
