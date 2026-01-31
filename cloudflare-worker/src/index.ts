/**
 * Cloudflare Worker for Taoist Fortune Calculator API
 * This worker acts as a secure proxy to DeepSeek API
 * The DeepSeek API key is hardcoded for this deployment
 */

// Hardcoded DeepSeek API Key
const DEEPSEEK_API_KEY = 'sk-fe74936882674bf5ab67e874d06628ec';

interface DeepSeekRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  response_format?: { type: string };
  stream?: boolean;
  temperature?: number;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GenerateFortuneBody {
  systemPrompt: string;
  userPrompt: string;
  jsonResponse?: boolean;
}

interface StartChatBody {
  systemPrompt: string;
  userPrompt: string;
}

interface ContinueChatBody {
  systemPrompt: string;
  conversation: string;
}

export interface Env {
  DEEPSEEK_API_KEY?: string;
}

/**
 * Handle CORS headers
 */
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

/**
 * Health check endpoint
 */
export async function handleHealthCheck(): Promise<Response> {
  return new Response(JSON.stringify({
    status: 'ok',
    service: 'Taoist Fortune Calculator API',
    timestamp: new Date().toISOString()
  }), {
    headers: corsHeaders(),
    status: 200
  });
}

/**
 * Handle OPTIONS request (CORS preflight)
 */
export async function handleOptions(): Promise<Response> {
  return new Response(null, {
    headers: corsHeaders(),
    status: 204
  });
}

/**
 * Call DeepSeek API
 */
async function callDeepSeekAPI(
  systemPrompt: string,
  userPrompt: string,
  jsonResponse = false
): Promise<DeepSeekResponse> {
  const body: DeepSeekRequest = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    stream: false,
    temperature: 0.8
  };

  if (jsonResponse) {
    body.response_format = { type: 'json_object' };
    body.temperature = 1.3;
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API Error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Generate fortune endpoint
 */
export async function handleGenerateFortune(request: Request): Promise<Response> {
  try {
    const body: GenerateFortuneBody = await request.json();
    const { systemPrompt, userPrompt } = body;

    const deepSeekResponse = await callDeepSeekAPI(
      systemPrompt,
      userPrompt,
      true
    );

    // Extract content from DeepSeek response
    const content = deepSeekResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    return new Response(content, {
      headers: corsHeaders(),
      status: 200
    });

  } catch (error: any) {
    console.error('Generate fortune error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Unable to generate fortune at this moment'
    }), {
      headers: corsHeaders(),
      status: 500
    });
  }
}

/**
 * Start master chat endpoint
 */
export async function handleStartChat(request: Request): Promise<Response> {
  try {
    const body: StartChatBody = await request.json();
    const { systemPrompt, userPrompt } = body;

    const deepSeekResponse = await callDeepSeekAPI(
      systemPrompt,
      userPrompt
    );

    const content = deepSeekResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    // Return chat message
    const chatMessage = {
      role: 'assistant',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(chatMessage), {
      headers: corsHeaders(),
      status: 200
    });

  } catch (error: any) {
    console.error('Start chat error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Master is unavailable at this moment'
    }), {
      headers: corsHeaders(),
      status: 500
    });
  }
}

/**
 * Continue master chat endpoint
 */
export async function handleContinueChat(request: Request): Promise<Response> {
  try {
    const body: ContinueChatBody = await request.json();
    const { systemPrompt, conversation } = body;

    const deepSeekResponse = await callDeepSeekAPI(
      systemPrompt,
      `Context:\n\n${conversation}`
    );

    const content = deepSeekResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    const chatMessage = {
      role: 'assistant',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(chatMessage), {
      headers: corsHeaders(),
      status: 200
    });

  } catch (error: any) {
    console.error('Continue chat error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Master is unavailable at this moment'
    }), {
      headers: corsHeaders(),
      status: 500
    });
  }
}

/**
 * Main request handler
 */
export default {
  async fetch(request: Request, env?: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Health check
    if (path === '/health') {
      return handleHealthCheck();
    }

    // Generate fortune endpoint
    if (path === '/api/generate-fortune' && request.method === 'POST') {
      return handleGenerateFortune(request);
    }

    // Start master chat endpoint
    if (path === '/api/start-chat' && request.method === 'POST') {
      return handleStartChat(request);
    }

    // Continue master chat endpoint
    if (path === '/api/continue-chat' && request.method === 'POST') {
      return handleContinueChat(request);
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({
      error: 'Not found',
      message: 'Use /api/generate-fortune, /api/start-chat, or /api/continue-chat'
    }), {
      headers: corsHeaders(),
      status: 404
    });
  }
};
