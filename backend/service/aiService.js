import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const generateRoadmap = async (topic, level, language = "english") => {
  const prompt = `
You are an expert curriculum designer.

Create a structured learning roadmap.

Topic: ${topic}
Level: ${level}
Language: ${language}

IMPORTANT:
- All human-readable content MUST be written in ${language}.
- Module titles must be in ${language}.
- Concepts must be in ${language}.
- Do not translate programming keywords, library names,
  framework names, API names, or technical identifiers.
- JSON property names must remain in English exactly as defined.
- Create 6-12 modules.
- Each module should contain 2-6 concepts.
- Modules must progress logically from beginner/fundamental
  concepts to advanced concepts appropriate for the requested level.
- prerequisiteStep must contain moduleIds that should be completed first.
- The first module should normally have an empty prerequisiteStep.
- Return ONLY valid JSON.

Return this structure:

{
  "modules": [
    {
      "moduleId": 1,
      "title": "Module title",
      "concept": [
        "Concept 1",
        "Concept 2"
      ],
      "prerequisiteStep": []
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          modules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                moduleId: { type: "integer" },
                title: { type: "string" },
                concept: { type: "array", items: { type: "string" } },
                prerequisiteStep: { type: "array", items: { type: "integer" } },
              },
              required: ["moduleId", "title", "concept", "prerequisiteStep"],
            },
          },
        },
        required: ["modules"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const generateModule = async (
  topic,
  moduleTitle,
  concept,
  language = "english",
) => {
  const prompt = `
You are an expert teacher and curriculum designer.

Topic:
${topic}

Module:
${moduleTitle}

Concepts:
${concept.join(", ")}

Language:
${language}

IMPORTANT LANGUAGE RULES:
- All educational text MUST be written in ${language}.
- Explanation must be in ${language}.
- Examples must be in ${language}.
- Practice questions must be in ${language}.
- connectionToNext must be in ${language}.
- Keep programming syntax, keywords, library names, API names and technical identifiers in their original form.
- JSON property names must remain in English.
- Make explanations beginner-friendly but technically accurate.

CRITICAL CODE SNIPPETS FORMATTING RULES:
- Each item in the "codeSnippets" array MUST be formatted as readable, multi-line code.
- ALWAYS use proper newlines (\\n) and spaces/tabs for indentation within code strings.
- NEVER flatten code into a single continuous line.
- Always include helpful code comments inside the snippet on their own lines.

INSTALLATION AND SETUP RULES:
- If the module needs any installation, setup, or terminal commands, provide them for BOTH operating systems.
- Create a SEPARATE item in "codeSnippets" for each operating system.
- Start each such snippet with a comment line naming the OS, for example "# Windows (PowerShell)" or "# Linux / macOS".
- Do not give installation commands for only one operating system.
- If the module needs no installation or setup, skip this rule.

- Return ONLY valid JSON.

Generate:
1. A detailed explanation of the module.
2. Practical examples.
3. Code snippets if the topic is programming.
4. Practice questions.
5. Explain how this module connects to the next concepts.

Return this structure:

{
  "explanation": "...",
  "examples": ["...", "..."],
  "codeSnippets": [
    "// Example comment\\nimport React from 'react';\\n\\nfunction App() {\\n  return <div>Hello</div>;\\n}\\n\\nexport default App;"
  ],
  "practiceQuestions": ["...", "..."],
  "connectionToNext": "..."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          explanation: { type: "string" },
          examples: { type: "array", items: { type: "string" } },
          codeSnippets: { type: "array", items: { type: "string" } },
          practiceQuestions: { type: "array", items: { type: "string" } },
          connectionToNext: { type: "string" },
        },
        required: [
          "explanation",
          "examples",
          "codeSnippets",
          "practiceQuestions",
          "connectionToNext",
        ],
      },
    },
  });

  return JSON.parse(response.text);
};
