export interface TaxonomyTopicDefinition {
  slug: string;
  label: string;
  subtopics: string[];
}

export interface TaxonomySelectOption {
  value: number;
  label: string;
  subtopics: Array<{
    value: number;
    label: string;
  }>;
}

export const TAXONOMY_TOPICS: TaxonomyTopicDefinition[] = [
  {
    slug: "plants-and-animals",
    label: "Plants and Animals",
    subtopics: [
      "Amphibians and Reptiles",
      "Biodiversity",
      "Birds",
      "Fish",
      "Invertebrates",
      "Mammals",
      "Plants",
      "Non-native or Invasive Species",
      "Other Organisms",
    ],
  },
  {
    slug: "extreme-weather-and-climate-events",
    label: "Extreme Weather and Climate Events",
    subtopics: [
      "Drought",
      "Extreme Heat",
      "Extreme Precipitation and Storms",
      "Fire",
      "Flooding and Inundation",
      "Other Extreme Events",
    ],
  },
  {
    slug: "landscapes",
    label: "Landscapes",
    subtopics: [
      "Alpine and Montane",
      "Arid and Semi-Arid",
      "Coasts",
      "Forests",
      "Grasslands",
      "Permafrost",
      "Other Landscapes",
    ],
  },
  {
    slug: "water",
    label: "Water",
    subtopics: [
      "Coral Reefs",
      "Groundwater",
      "Lakes",
      "Oceans",
      "Rivers and Streams",
      "Sea Level Rise",
      "Snow and Ice",
      "Wetlands",
    ],
  },
  {
    slug: "technical-support-for-partners",
    label: "Technical Support for Partners",
    subtopics: [
      "Resist-Accept-Direct Framework",
      "Synthesis",
      "State Wildlife Action Plan Support",
      "Other Technical Support",
    ],
  },
  {
    slug: "indigenous-peoples-and-local-communities",
    label: "Indigenous Peoples and Local Communities",
    subtopics: [
      "Tribes and Tribal Organizations",
      "Alaska Natives",
      "Native Hawaiian and Pacific Islander Communities",
      "Other Local Communities",
    ],
  },
];

export const HOME_TOPIC_LINKS = TAXONOMY_TOPICS.map(({ slug, label }) => ({
  id: slug,
  name: label,
}));

export const TOPIC_LABEL_BY_SLUG = TAXONOMY_TOPICS.reduce(
  (labels, topic) => {
    labels[topic.slug] = topic.label;
    return labels;
  },
  {} as Record<string, string>,
);

export const TOPIC_SLUG_BY_LABEL = TAXONOMY_TOPICS.reduce(
  (slugs, topic) => {
    slugs[topic.label] = topic.slug;
    return slugs;
  },
  {} as Record<string, string>,
);

export const SUBTOPIC_ROUTE_BY_LABEL = TAXONOMY_TOPICS.reduce(
  (routes, topic) => {
    for (const subtopic of topic.subtopics) {
      routes[subtopic] =
        `${topic.slug};subtopic=${encodeURIComponent(subtopic)}`;
    }
    return routes;
  },
  {} as Record<string, string>,
);

export const TOPIC_SELECT_OPTIONS: TaxonomySelectOption[] = TAXONOMY_TOPICS.map(
  (topic, topicIndex) => ({
    value: topicIndex,
    label: topic.label,
    subtopics: topic.subtopics.map((subtopic, subtopicIndex) => ({
      value: subtopicIndex,
      label: subtopic,
    })),
  }),
);
