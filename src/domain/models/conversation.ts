export interface Conversation {
    id: number;
    context: number;
    answer: string;
	type: string;
	typedText: string;
	attachments?: string[];
	isStarted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface TemporaryConversation extends Conversation {
	from: string;
}
