type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const conversations = new Map<string, Message[]>();

const MAX_MESSAGES = 10;

export function getConversation(conversationId: string): Message[] {
  return conversations.get(conversationId) ?? [];
}

export function addMessage(
  conversationId: string,
  message: Message,
): void {
  const messages = conversations.get(conversationId) ?? [];

  messages.push(message);

  if (messages.length > MAX_MESSAGES) {
    messages.splice(0, messages.length - MAX_MESSAGES);
  }

  conversations.set(conversationId, messages);
}

export function clearConversation(conversationId: string): void {
  conversations.delete(conversationId);
}