export type Project = {
  name: string;
  summary: string;
  technologies: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  statusNote?: string;
};

export type TechnologyGroup = {
  category: string;
  technologies: string[];
  context: string;
};
