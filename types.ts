export enum ProjectStatus {
  DRAFT = 'Draft',
  GENERATING = 'Generating',
  READY = 'Ready',
  PUBLISHED = 'Published'
}

export interface RecipeIdea {
  id: string;
  title: string;
  description: string;
  viralityScore: number; // 1-100
  ingredients: string[];
}

export enum FrameType {
  HOOK = 'HOOK',
  INGREDIENTS = 'INGREDIENTS',
  STEP = 'STEP',
  RESULT = 'RESULT'
}

export interface VideoFrame {
  id: string;
  type: FrameType;
  prompt: string; // The prompt sent to image gen
  description: string; // User facing description
  imageUrl?: string; // Base64 or URL
  status: 'pending' | 'generating' | 'completed' | 'failed';
}

export interface Project {
  id: string;
  title: string;
  recipe?: RecipeIdea;
  frames: VideoFrame[];
  status: ProjectStatus;
  createdAt: Date;
}

export interface GeminiError {
  message: string;
}