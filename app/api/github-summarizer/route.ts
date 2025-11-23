import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

// Define the structured output schema
const GitHubSummarySchema = z.object({
  Summary: z.string().describe('A comprehensive summary of the GitHub repository'),
  CoolFacts: z.array(z.string()).describe('A list of interesting and cool facts about the repository')
});

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { message: 'Repository URL is required' },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubUrlPattern.test(repoUrl)) {
      return NextResponse.json(
        { message: 'Invalid GitHub repository URL format' },
        { status: 400 }
      );
    }

    // Extract owner and repo from URL
    const urlParts = repoUrl.replace(/\/$/, '').split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    console.log('[github-summarizer] Processing repo:', owner, '/', repo);

    // Fetch repository information from GitHub API
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Summarizer'
      }
    });

    if (!repoResponse.ok) {
      console.error('[github-summarizer] GitHub API error:', repoResponse.status);
      return NextResponse.json(
        { message: 'Repository not found or unable to access' },
        { status: 404 }
      );
    }

    const repoData = await repoResponse.json();

    // Fetch README - Full content
    let readmeContent = 'No README found';
    try {
      const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Summarizer'
        }
      });
      
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        // Decode base64 content - Get the entire README
        readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      }
    } catch (error) {
      console.warn('[github-summarizer] Could not fetch README:', error);
    }

    // Create LangChain chain with structured output
    console.log('[github-summarizer] Invoking LLM to generate summary...');

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('[github-summarizer] OPENAI_API_KEY not configured');
      return NextResponse.json(
        { message: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Initialize the LLM with structured output
    const llm = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create the prompt template
    const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert at analyzing GitHub repositories. Summarize this GitHub repository from the README.md file content.

Repository Information:
- Name: {repoName}
- Description: {description}
- Language: {language}
- Stars: {stars}
- Forks: {forks}
- License: {license}

README.md Content:
{readmeContent}

Provide a comprehensive summary of what this repository does, its key features, and list some cool/interesting facts about it.
    `);

    // Create a chain with structured output
    const structuredLLM = llm.withStructuredOutput(GitHubSummarySchema);
    const chain = promptTemplate.pipe(structuredLLM);

    try {
      // Invoke the chain
      const result = await chain.invoke({
        repoName: repoData.full_name,
        description: repoData.description || 'No description provided',
        language: repoData.language || 'Not specified',
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        license: repoData.license?.name || 'No license',
        readmeContent: readmeContent
      });

      console.log('[github-summarizer] LLM summary generated successfully');

      // Format the summary with repository info and LLM-generated content
      const summary = `
Repository: ${repoData.full_name}
Description: ${repoData.description || 'No description provided'}

Language: ${repoData.language || 'Not specified'}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Open Issues: ${repoData.open_issues_count}

Created: ${new Date(repoData.created_at).toLocaleDateString()}
Last Updated: ${new Date(repoData.updated_at).toLocaleDateString()}

License: ${repoData.license?.name || 'No license'}
Default Branch: ${repoData.default_branch}

AI-Generated Summary:
${result.Summary}

Cool Facts:
${result.CoolFacts.map((fact, index) => `${index + 1}. ${fact}`).join('\n')}
      `.trim();

      console.log('[github-summarizer] Summary generated successfully');
      
      return NextResponse.json(
        { 
          success: true,
          summary,
          repoInfo: {
            name: repoData.full_name,
            stars: repoData.stargazers_count,
            language: repoData.language
          }
        },
        { status: 200 }
      );

    } catch (llmError) {
      console.error('[github-summarizer] LLM Error:', llmError);
      return NextResponse.json(
        { message: 'Failed to generate AI summary. Error: ' + (llmError as Error).message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[github-summarizer] Error:', error);
    return NextResponse.json(
      { message: 'An error occurred while summarizing the repository' },
      { status: 500 }
    );
  }
}

