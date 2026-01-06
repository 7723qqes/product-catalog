function renderBody(status, content) {
  const html = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener('message', receiveMessage, false);
      };
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    </script>
  `;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return renderBody('error', { error: 'No code provided' });
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ client_id, client_secret, code })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return renderBody('error', tokenData);
    }

    return renderBody('success', {
      token: tokenData.access_token,
      provider: 'github'
    });
  } catch (error) {
    return renderBody('error', { error: error.message });
  }
}
