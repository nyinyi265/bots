export type Message = {
  role: "user" | "assistant";
  content: string;
  userId?: string;
  username?: string;
};

export type Topic = {
  id: string;
  name: string;
  keywords: string[];
  messages: Message[];
};

type Conversation = {
  messages: Message[];
  topics: Topic[];
  currentTopicId?: string;
};

const conversations = new Map<string, Conversation>();

const MAX_MESSAGES = 10;

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length >= 4);
}

export function getConversation(conversationId: string): Message[] {
  const conversation = conversations.get(conversationId);

  return conversation?.messages ?? [];
}

export function addMessage(
  conversationId: string,
  message: Message,
  topicId?: string,
): void {
  const conversation = conversations.get(conversationId) ?? {
    messages: [],
    topics: [],
  };

  conversation.messages.push(message);

  if (conversation.messages.length > MAX_MESSAGES) {
    conversation.messages.splice(
      0,
      conversation.messages.length - MAX_MESSAGES,
    );
  }

  if (topicId) {
    const topic = conversation.topics.find((topic) => topic.id === topicId);

    if (topic) {
      topic.messages.push(message);
    }
  }

  conversations.set(conversationId, conversation);
}

export function createTopic(conversationId: string, name: string): Topic {
  const conversation = conversations.get(conversationId) ?? {
    messages: [],
    topics: [],
  };

  const topic: Topic = {
    id: crypto.randomUUID(),
    name,
    keywords: extractKeywords(name),
    messages: [],
  };

  conversation.topics.push(topic);
  conversation.currentTopicId = topic.id;

  conversations.set(conversationId, conversation);

  return topic;
}

export function getCurrentTopic(conversationId: string): Topic | undefined {
  const conversation = conversations.get(conversationId);

  if (!conversation?.currentTopicId) {
    return undefined;
  }

  return conversation.topics.find(
    (topic) => topic.id === conversation.currentTopicId,
  );
}

export function findMatchingTopic(
  conversationId: string,
  message: string,
): Topic | undefined {
  const conversation = conversations.get(conversationId);

  if (!conversation || conversation.topics.length === 0) {
    return undefined;
  }

  const messageKeywords = extractKeywords(message);

  let bestTopic: Topic | undefined;
  let bestScore = 0;

  for (const topic of conversation.topics) {
    const score = messageKeywords.filter((keyword) =>
      topic.keywords.includes(keyword),
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestTopic;
}

export function getOrCreateTopic(
  conversationId: string,
  message: string,
): Topic {
  const existingTopic = findMatchingTopic(conversationId, message);

  if (existingTopic) {
    return existingTopic;
  }

  return createTopic(conversationId, message);
}

export function getTopicMessages(
  conversationId: string,
  topicId: string,
): Message[] {
  const conversation = conversations.get(conversationId);

  if (!conversation) {
    return [];
  }

  const topic = conversation.topics.find((topic) => topic.id === topicId);

  return topic?.messages ?? [];
}

export function getTopics(conversationId: string): Topic[] {
  const conversation = conversations.get(conversationId);

  return conversation?.topics ?? [];
}

export function clearConversation(conversationId: string): void {
  conversations.delete(conversationId);
}
