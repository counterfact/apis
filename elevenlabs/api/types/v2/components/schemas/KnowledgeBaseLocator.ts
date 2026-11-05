import type { KnowledgeBaseDocumentType } from "./KnowledgeBaseDocumentType.js";
import type { DocumentUsageModeEnum } from "./DocumentUsageModeEnum.js";
/**
 * @example {"id":"123","name":"My Knowledge Base","type":"file","usage_mode":"auto"}
 */
export type KnowledgeBaseLocator = {
  /**
   * The type of the knowledge base
   */
  type: KnowledgeBaseDocumentType;
  /**
   * The name of the knowledge base
   */
  name: string;
  /**
   * The ID of the knowledge base
   */
  id: string;
  /**
   * The usage mode of the knowledge base
   * @default "auto"
   */
  usage_mode?: DocumentUsageModeEnum;
};
