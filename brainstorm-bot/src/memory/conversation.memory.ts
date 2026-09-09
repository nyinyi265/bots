export type Message = {
  role: "user" | "assistant";
  content: string;
  userId?: string;
  username?: string;
};

type Conversation = {
  messages: Message[];
};

const conversations = new Map<string, Conversation>();

const MAX_MESSAGES = 10;

export function getConversation(conversationId: string): Message[] {
  const conversation = conversations.get(conversationId);

  return conversation?.messages ?? [];
}

export function addMessage(conversationId: string, message: Message): void {
  const conversation = conversations.get(conversationId) ?? {
    messages: [],
  };

  conversation.messages.push(message);

  if (conversation.messages.length > MAX_MESSAGES) {
    conversation.messages.splice(
      0,
      conversation.messages.length - MAX_MESSAGES,
    );
  }

  conversations.set(conversationId, conversation);
}

export function clearConversation(conversationId: string): void {
  conversations.delete(conversationId);
}
